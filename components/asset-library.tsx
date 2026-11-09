"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, Download, File, Folder, FolderPlus, Search, Trash2, Upload, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { driveRequest, DriveRequestError, uploadAsset } from "@/lib/upload-asset";
import { formatBytes, type DriveAsset, type DriveListing } from "@/lib/asset-types";
import type { MaterialReference } from "@/lib/builtin-materials";
import { usePreferences } from "@/components/preferences-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function AssetLibrary({ onSelect }: { onSelect?: (asset: MaterialReference) => void }) {
  const { t, locale } = usePreferences();
  const { data: session, isPending } = authClient.useSession();
  const [folder, setFolder] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [revision, setRevision] = useState(0);
  const [listing, setListing] = useState<{ key: string; data: DriveListing } | null>(null);
  const [error, setError] = useState("");
  const [newFolder, setNewFolder] = useState(false);
  const [upload, setUpload] = useState<{ name: string; progress: number } | null>(null);
  const cancel = useRef<AbortController | null>(null);
  const picker = useRef<HTMLInputElement>(null);
  const key = `${session?.user.id}/${folder}/${search}/${revision}`;
  const data = listing?.key === key ? listing.data : null;
  const userId = session?.user.id;
  function failure(reason: unknown) {
    const code = reason instanceof DriveRequestError ? reason.code : "storage_failed";
    setError(t(code === "quota_exceeded" ? "quotaExceeded" : code === "folder_exists" ? "folderExists" : code === "upload_expired" ? "uploadExpired" : "driveFailed"));
  }
  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    const params = new URLSearchParams({ q: search }); if (folder) params.set("folderId", folder);
    driveRequest<DriveListing>(`/api/assets?${params}`, { signal: controller.signal }).then(
      (value) => { setListing({ key, data: value }); },
      () => { if (!controller.signal.aborted) setError(t("driveFailed")); },
    );
    return () => controller.abort();
  }, [userId, folder, search, key, t]);
  useEffect(() => () => cancel.current?.abort(), []);
  async function choose(file: DriveAsset) {
    try {
      const access = await driveRequest<{ asset: DriveAsset; url: string }>(`/api/assets/${file.id}`);
      onSelect?.({ id: file.id, src: access.url, label: file.filename, contentType: file.contentType, origin: "user" });
    } catch (reason) { failure(reason); }
  }
  return <section className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold">{t(onSelect ? "chooseAsset" : "assets")}</h1>
      {session && <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setNewFolder(!newFolder)}><FolderPlus />{t("newFolder")}</Button>
        <Button disabled={!!upload} onClick={() => picker.current?.click()}><Upload />{t("upload")}</Button>
      </div>}
    </div>
    {isPending ? <p role="status" className="text-sm text-muted-foreground">{t("working")}</p> : !session ? (
      <Card><CardContent className="flex min-h-64 items-center justify-center"><Button asChild><Link href="/login">{t("signInForAssets")}</Link></Button></CardContent></Card>
    ) : <>
      {data && <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground"><span>{t("storageUsed")} {formatBytes(data.quota.used, locale)} / {formatBytes(data.quota.limit, locale)}</span>{data.quota.reserved > 0 && <span>{t("reserved")} {formatBytes(data.quota.reserved, locale)}</span>}</div>
        <div role="progressbar" aria-label={t("storageUsed")} aria-valuenow={data.quota.used + data.quota.reserved} aria-valuemin={0} aria-valuemax={data.quota.limit} className="h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none" style={{ width: `${(data.quota.used + data.quota.reserved) / data.quota.limit * 100}%` }} /></div>
      </div>}
      <input ref={picker} className="sr-only" type="file" multiple aria-label={t("upload")} onChange={async (event) => {
        const files = Array.from(event.target.files ?? []); event.target.value = ""; setError("");
        const controller = new AbortController(); cancel.current = controller;
        try {
          for (const file of files) {
            if (controller.signal.aborted) break;
            setUpload({ name: file.name, progress: 0 });
            await uploadAsset(file, folder, (progress) => setUpload({ name: file.name, progress }), controller.signal);
            setRevision((value) => value + 1);
          }
        } catch (reason) { if (controller.signal.aborted) setError(t("uploadCancelled")); else failure(reason); }
        finally { setUpload(null); cancel.current = null; setRevision((value) => value + 1); }
      }} />
      {upload && <Card><CardContent className="space-y-2"><div className="flex items-center justify-between gap-3"><span className="min-w-0 break-all text-sm">{upload.name} {upload.progress}%</span><Button variant="ghost" size="icon" aria-label={t("cancel")} onClick={() => cancel.current?.abort()}><X /></Button></div><progress aria-label={upload.name} max={100} value={upload.progress} className="h-2 w-full accent-primary" /></CardContent></Card>}
      <div className="flex flex-wrap items-center gap-1 text-sm">
        <Button variant="ghost" size="sm" onClick={() => { setFolder(null); setSearch(""); setQuery(""); }}>{t("allAssets")}</Button>
        {data?.breadcrumbs.map((item) => <span key={item.id} className="inline-flex items-center gap-1"><ChevronRight className="size-4 text-muted-foreground" /><Button variant="ghost" size="sm" onClick={() => { setFolder(item.id); setSearch(""); setQuery(""); }}>{item.name}</Button></span>)}
      </div>
      {newFolder && <form className="flex gap-2" onSubmit={async (event) => {
        event.preventDefault(); const form = new FormData(event.currentTarget);
        try { await driveRequest("/api/folders", { method: "POST", body: JSON.stringify({ name: form.get("name"), parentId: folder }) }); setNewFolder(false); setRevision((value) => value + 1); }
        catch (reason) { failure(reason); }
      }}><Input name="name" aria-label={t("folderName")} autoFocus required /><Button type="submit">{t("createFolder")}</Button><Button variant="outline" type="button" onClick={() => setNewFolder(false)}>{t("cancel")}</Button></form>}
      <form role="search" className="flex gap-2" onSubmit={(event) => { event.preventDefault(); setSearch(query); }}><Input className="h-10" aria-label={t("searchAssets")} value={query} onChange={(event) => { setQuery(event.target.value); if (!event.target.value) setSearch(""); }} /><Button type="submit" className="h-10"><Search />{t("search")}</Button></form>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {!data ? error ? <Button variant="outline" onClick={() => { setError(""); setRevision((value) => value + 1); }}>{t("retry")}</Button> : <p role="status" className="text-sm text-muted-foreground">{t("working")}</p> : <Card><CardContent className="divide-y">
        {data.folders.map((item) => <button key={item.id} className="flex w-full items-center gap-3 py-3 text-left hover:text-primary focus-visible:outline-2 focus-visible:outline-ring" onClick={() => { setFolder(item.id); setQuery(""); setSearch(""); }}><Folder className="size-5 shrink-0" /><span className="min-w-0 flex-1 break-all">{item.name}</span><ChevronRight className="size-4" /></button>)}
        {data.files.map((file) => <div key={file.id} className="flex flex-wrap items-center gap-3 py-3">
          <File className="size-5 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">{onSelect ? <button className="text-left text-sm font-medium break-all hover:underline focus-visible:outline-2 focus-visible:outline-ring" onClick={() => choose(file)}>{file.filename}</button> : <p className="break-all text-sm font-medium">{file.filename}</p>}<p className="text-xs text-muted-foreground">{formatBytes(file.size, locale)}</p></div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label={`${t("download")} ${file.filename}`} onClick={async () => { try { const access = await driveRequest<{ url: string }>(`/api/assets/${file.id}`); const link = document.createElement("a"); link.href = access.url; link.download = file.filename; link.click(); } catch (reason) { failure(reason); } }}><Download /></Button>
            <Button variant="ghost" size="icon" aria-label={`${t("deleteAsset")} ${file.filename}`} onClick={async () => { try { await driveRequest(`/api/assets/${file.id}`, { method: "DELETE" }); setRevision((value) => value + 1); } catch (reason) { failure(reason); } }}><Trash2 /></Button>
          </div>
        </div>)}
        {!data.files.length && !data.folders.length && <p className="py-16 text-center text-sm text-muted-foreground">{t("noAssets")}</p>}
      </CardContent></Card>}
    </>}
  </section>;
}
