export type DriveAsset = {
  id: string; filename: string; contentType: string; size: number;
  folderId: string | null; createdAt: string;
};
export type DriveFolder = { id: string; name: string; parentId: string | null };
export type DriveListing = {
  files: DriveAsset[]; folders: DriveFolder[]; breadcrumbs: DriveFolder[];
  quota: { limit: number; used: number; reserved: number };
};
export type UploadSession = {
  assetId: string; bucket: string; region: string; endpoint: string; key: string;
  uploadId: string | null; partSize: number; expiresAt: number; serverTime: number;
  credentials: { accessKeyId: string; secretAccessKey: string; sessionToken: string };
};

export function formatBytes(bytes: number, locale: string) {
  const unit = bytes >= 1e9 ? 1e9 : bytes >= 1e6 ? 1e6 : bytes >= 1e3 ? 1e3 : 1;
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(bytes / unit)} ${unit === 1e9 ? "GB" : unit === 1e6 ? "MB" : unit === 1e3 ? "KB" : "B"}`;
}
