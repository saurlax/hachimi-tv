import "server-only";
import { randomUUID } from "node:crypto";
import {
  AbortMultipartUploadCommand, CompleteMultipartUploadCommand, CreateMultipartUploadCommand,
  DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, ListPartsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { database } from "./database";
import { AssetError } from "./asset-api";
import { bucket, endpoint, issueUploadCredentials, region, storage } from "./storage";
import type { DriveAsset, DriveFolder, DriveListing, UploadSession } from "@/lib/asset-types";

const DEFAULT_QUOTA = 10_000_000_000;
export const PART_SIZE = 16 * 1024 * 1024;
type AssetRow = {
  id: string; user_id: string; filename: string; content_type: string; size: number;
  object_key: string; status: string; created_at: string; folder_id: string | null;
  upload_id: string | null; expires_at: number | null;
};
type FolderRow = { id: string; user_id: string; parent_id: string | null; name: string };
const fileInfo = (row: AssetRow): DriveAsset => ({ id: row.id, filename: row.filename, contentType: row.content_type, size: row.size, folderId: row.folder_id, createdAt: row.created_at });
const folderInfo = (row: FolderRow): DriveFolder => ({ id: row.id, name: row.name, parentId: row.parent_id });

function ownedAsset(userId: string, id: string) {
  const row = database.prepare("SELECT * FROM media_asset WHERE id=? AND user_id=?").get(id, userId) as AssetRow | undefined;
  if (!row) throw new AssetError("not_found", 404);
  return row;
}
function ownedFolder(userId: string, id: string) {
  const row = database.prepare("SELECT * FROM asset_folder WHERE id=? AND user_id=?").get(id, userId) as FolderRow | undefined;
  if (!row) throw new AssetError("not_found", 404);
  return row;
}
export function storageQuota(userId: string) {
  const limit = database.prepare("SELECT limit_bytes FROM asset_quota WHERE user_id=?").get(userId) as { limit_bytes: number } | undefined;
  const totals = database.prepare(`SELECT
    COALESCE(SUM(CASE WHEN status='ready' THEN size ELSE 0 END),0) AS used,
    COALESCE(SUM(CASE WHEN status IN ('pending','cancelled','deleted') AND expires_at>? THEN size ELSE 0 END),0) AS reserved
    FROM media_asset WHERE user_id=?`).get(Date.now(), userId) as { used: number; reserved: number };
  return { limit: limit?.limit_bytes ?? DEFAULT_QUOTA, ...totals };
}
async function removeObject(row: AssetRow) {
  if (row.upload_id) {
    try { await storage.send(new AbortMultipartUploadCommand({ Bucket: bucket, Key: row.object_key, UploadId: row.upload_id })); }
    catch (error) { if ((error as { name: string }).name !== "NoSuchUpload") throw error; }
  }
  await storage.send(new DeleteObjectCommand({ Bucket: bucket, Key: row.object_key }));
}
async function cleanExpired(userId: string) {
  const rows = database.prepare("SELECT * FROM media_asset WHERE user_id=? AND status IN ('pending','cancelled','deleted','cleanup') AND expires_at<=?").all(userId, Date.now()) as AssetRow[];
  for (const row of rows) {
    const claimed = database.prepare("UPDATE media_asset SET status='cleanup' WHERE id=? AND status IN ('pending','cancelled','deleted','cleanup') AND expires_at<=?").run(row.id, Date.now());
    if (!claimed.changes) continue;
    await removeObject(row);
    database.prepare("DELETE FROM media_asset WHERE id=? AND status='cleanup'").run(row.id);
  }
}
export async function listAssets(userId: string, folderId: string | null, query: string): Promise<DriveListing> {
  await cleanExpired(userId);
  const breadcrumbs: DriveFolder[] = [];
  let parent = folderId;
  while (parent) { const row = ownedFolder(userId, parent); breadcrumbs.unshift(folderInfo(row)); parent = row.parent_id; }
  const files = database.prepare("SELECT * FROM media_asset WHERE user_id=? AND status='ready' AND folder_id IS ? AND instr(lower(filename),lower(?))>0 ORDER BY created_at DESC").all(userId, folderId, query) as AssetRow[];
  const folders = database.prepare("SELECT * FROM asset_folder WHERE user_id=? AND parent_id IS ? AND instr(lower(name),lower(?))>0 ORDER BY name").all(userId, folderId, query) as FolderRow[];
  return { files: files.map(fileInfo), folders: folders.map(folderInfo), breadcrumbs, quota: storageQuota(userId) };
}
export function createFolder(userId: string, body: Record<string, unknown>) {
  if (typeof body.name !== "string" || !body.name.trim() || (body.parentId !== null && typeof body.parentId !== "string")) throw new AssetError("invalid_request", 400);
  if (body.parentId) ownedFolder(userId, body.parentId);
  const duplicate = database.prepare("SELECT id FROM asset_folder WHERE user_id=? AND parent_id IS ? AND name=?").get(userId, body.parentId, body.name.trim());
  if (duplicate) throw new AssetError("folder_exists", 409);
  const id = randomUUID();
  database.prepare("INSERT INTO asset_folder (id,user_id,parent_id,name,created_at) VALUES (?,?,?,?,?)").run(id, userId, body.parentId, body.name.trim(), new Date().toISOString());
  return { id };
}
export async function reserveUpload(userId: string, body: Record<string, unknown>) {
  if (typeof body.filename !== "string" || !body.filename.trim() || typeof body.size !== "number" || !Number.isSafeInteger(body.size) || body.size < 0 || typeof body.contentType !== "string" || (body.folderId !== null && typeof body.folderId !== "string")) throw new AssetError("invalid_request", 400);
  if (body.folderId) ownedFolder(userId, body.folderId);
  await cleanExpired(userId);
  const id = randomUUID();
  const key = `users/${userId}/assets/${body.folderId ?? "root"}/${id}`;
  database.exec("BEGIN IMMEDIATE");
  try {
    const quota = storageQuota(userId);
    if (quota.used + quota.reserved + body.size > quota.limit) throw new AssetError("quota_exceeded", 409);
    database.prepare("INSERT OR IGNORE INTO asset_quota (user_id,limit_bytes) VALUES (?,?)").run(userId, DEFAULT_QUOTA);
    database.prepare("INSERT INTO media_asset (id,user_id,filename,content_type,size,object_key,status,created_at,folder_id,expires_at) VALUES (?,?,?,?,?,?,'pending',?,?,?)").run(id, userId, body.filename, body.contentType || "application/octet-stream", body.size, key, new Date().toISOString(), body.folderId, Date.now() + 900_000);
    database.exec("COMMIT");
  } catch (error) { database.exec("ROLLBACK"); throw error; }
  try {
    if (body.size > PART_SIZE * 2) {
      const multipart = await storage.send(new CreateMultipartUploadCommand({ Bucket: bucket, Key: key, ContentType: body.contentType || "application/octet-stream" }));
      database.prepare("UPDATE media_asset SET upload_id=? WHERE id=?").run(multipart.UploadId!, id);
    }
    return await uploadSession(userId, id);
  } catch (error) {
    // Keep any issued write lease reserved until expiration.
    database.prepare("UPDATE media_asset SET status='cancelled' WHERE id=?").run(id);
    throw error;
  }
}
export async function uploadSession(userId: string, id: string): Promise<UploadSession> {
  const row = ownedAsset(userId, id);
  if (row.status !== "pending" || row.expires_at! <= Date.now()) throw new AssetError("upload_expired", 409);
  database.prepare("UPDATE media_asset SET expires_at=? WHERE id=? AND status='pending'").run(Date.now() + 900_000, id);
  const issued = await issueUploadCredentials(row.object_key, row.upload_id ? Math.min(row.size, PART_SIZE) : row.size, !!row.upload_id);
  database.prepare("UPDATE media_asset SET expires_at=? WHERE id=?").run(issued.expiresAt * 1000, id);
  return { assetId: id, key: row.object_key, bucket, endpoint, region, uploadId: row.upload_id, partSize: PART_SIZE, ...issued };
}
export async function finishUpload(userId: string, id: string) {
  const row = ownedAsset(userId, id);
  if (row.status === "ready") return fileInfo(row);
  if (row.status !== "pending" || row.expires_at! <= Date.now()) throw new AssetError("upload_expired", 409);
  if (row.upload_id) {
    try {
    const parts = [];
    let marker: string | undefined;
    do {
      const page = await storage.send(new ListPartsCommand({ Bucket: bucket, Key: row.object_key, UploadId: row.upload_id, PartNumberMarker: marker }));
      parts.push(...(page.Parts ?? [])); marker = page.IsTruncated ? page.NextPartNumberMarker : undefined;
    } while (marker);
    const count = Math.ceil(row.size / PART_SIZE);
    if (parts.length !== count || parts.some((part, index) => part.PartNumber !== index + 1 || part.Size !== Math.min(PART_SIZE, row.size - index * PART_SIZE))) throw new AssetError("size_mismatch", 409);
    await storage.send(new CompleteMultipartUploadCommand({ Bucket: bucket, Key: row.object_key, UploadId: row.upload_id, MultipartUpload: { Parts: parts.map(({ ETag, PartNumber }) => ({ ETag, PartNumber })) } }));
    } catch (error) {
      if ((error as { name: string }).name !== "NoSuchUpload") throw error;
    }
  }
  let head;
  try { head = await storage.send(new HeadObjectCommand({ Bucket: bucket, Key: row.object_key })); }
  catch (error) { if ((error as { $metadata?: { httpStatusCode: number } }).$metadata?.httpStatusCode === 404) throw new AssetError("upload_missing", 409); throw error; }
  if (head.ContentLength !== row.size) throw new AssetError("size_mismatch", 409);
  database.prepare("UPDATE media_asset SET status='ready',upload_id=NULL WHERE id=? AND user_id=? AND status='pending'").run(id, userId);
  const completed = ownedAsset(userId, id);
  if (completed.status !== "ready") throw new AssetError("upload_expired", 409);
  return fileInfo(completed);
}
export async function deleteAsset(userId: string, id: string) {
  const row = ownedAsset(userId, id);
  await removeObject(row);
  database.prepare("UPDATE media_asset SET status=? WHERE id=?").run(row.status === "ready" ? "deleted" : "cancelled", id);
  if ((row.expires_at ?? 0) <= Date.now()) database.prepare("DELETE FROM media_asset WHERE id=?").run(id);
  return { deleted: true };
}
export async function assetAccess(userId: string, id: string) {
  const row = ownedAsset(userId, id);
  if (row.status !== "ready") throw new AssetError("not_found", 404);
  const url = await getSignedUrl(storage, new GetObjectCommand({ Bucket: bucket, Key: row.object_key, ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(row.filename)}` }), { expiresIn: 900 });
  return { asset: fileInfo(row), url };
}
/** Agent callers must supply the authenticated job owner's user ID. */
export async function readAsset(userId: string, id: string) {
  const row = ownedAsset(userId, id);
  if (row.status !== "ready") throw new AssetError("not_found", 404);
  const object = await storage.send(new GetObjectCommand({ Bucket: bucket, Key: row.object_key }));
  return { asset: fileInfo(row), body: object.Body! };
}
