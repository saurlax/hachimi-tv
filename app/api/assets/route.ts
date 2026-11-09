import { assetResponse, currentUser, objectBody } from "@/lib/server/asset-api";
import { listAssets, reserveUpload } from "@/lib/server/assets";
export const runtime = "nodejs";
export async function GET(request: Request) {
  return assetResponse(async () => {
    const user = await currentUser(request); const params = new URL(request.url).searchParams;
    return listAssets(user.id, params.get("folderId"), params.get("q") ?? "");
  });
}
export async function POST(request: Request) {
  return assetResponse(async () => reserveUpload((await currentUser(request)).id, await objectBody(request)));
}
