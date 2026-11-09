import { assetResponse, currentUser } from "@/lib/server/asset-api";
import { assetAccess, deleteAsset } from "@/lib/server/assets";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, context: Context) {
  return assetResponse(async () => assetAccess((await currentUser(request)).id, (await context.params).id));
}
export async function DELETE(request: Request, context: Context) {
  return assetResponse(async () => deleteAsset((await currentUser(request)).id, (await context.params).id));
}
