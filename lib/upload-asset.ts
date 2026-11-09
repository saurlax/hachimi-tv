"use client";
import { PutObjectCommand, S3Client, UploadPartCommand } from "@aws-sdk/client-s3";
import type { DriveAsset, UploadSession } from "./asset-types";

export class DriveRequestError extends Error {
  constructor(public code: string) { super(code); }
}
export async function driveRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...options, cache: "no-store", headers: { "Content-Type": "application/json", ...options?.headers } });
  const data = await response.json();
  if (!response.ok) throw new DriveRequestError(data.error);
  return data;
}
export async function uploadAsset(file: File, folderId: string | null, onProgress: (progress: number) => void, signal: AbortSignal): Promise<DriveAsset> {
  let session = await driveRequest<UploadSession>("/api/assets", { method: "POST", body: JSON.stringify({ filename: file.name, size: file.size, contentType: file.type || "application/octet-stream", folderId }), signal });
  const id = session.assetId;
  const client = new S3Client({ endpoint: session.endpoint, region: session.region,
    credentials: async () => {
      if (session.expiresAt * 1000 - Date.now() < 60_000) session = await driveRequest<UploadSession>(`/api/assets/${id}/upload`, { signal });
      return session.credentials;
    },
    systemClockOffset: session.serverTime * 1000 - Date.now(),
    requestChecksumCalculation: "WHEN_REQUIRED", responseChecksumValidation: "WHEN_REQUIRED",
  });
  if (!session.uploadId) client.middlewareStack.add((next) => async (args) => {
    (args.request as { headers: Record<string, string> }).headers["x-cos-forbid-overwrite"] = "true";
    return next(args);
  }, { step: "build", name: "cosForbidOverwrite" });
  try {
    if (session.uploadId) {
      let completed = 0;
      let next = 0;
      const count = Math.ceil(file.size / session.partSize);
      async function uploadParts() {
        while (next < count) {
          const part = next++;
          const body = file.slice(part * session.partSize, Math.min(file.size, (part + 1) * session.partSize));
          await client.send(new UploadPartCommand({ Bucket: session.bucket, Key: session.key, UploadId: session.uploadId!, PartNumber: part + 1, Body: body, ContentLength: body.size }), { abortSignal: signal });
          completed += body.size; onProgress(Math.round(completed / file.size * 100));
        }
      }
      const results = await Promise.allSettled([uploadParts(), uploadParts()]);
      const failed = results.find((result) => result.status === "rejected");
      if (failed?.status === "rejected") throw failed.reason;
    } else {
      await client.send(new PutObjectCommand({ Bucket: session.bucket, Key: session.key, Body: file, ContentType: file.type || "application/octet-stream", ContentLength: file.size }), { abortSignal: signal });
      onProgress(100);
    }
    return await driveRequest<DriveAsset>(`/api/assets/${id}/upload`, { method: "POST", signal });
  } catch (error) {
    await driveRequest(`/api/assets/${id}`, { method: "DELETE" }).catch(() => undefined);
    throw error;
  } finally { client.destroy(); }
}
