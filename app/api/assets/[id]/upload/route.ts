import { assetResponse, currentUser } from "@/lib/server/asset-api";
import { finishUpload, uploadSession } from "@/lib/server/assets";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export async function GET(request: Request, context: Context) {
  return assetResponse(async () => uploadSession((await currentUser(request)).id, (await context.params).id));
}
export async function POST(request: Request, context: Context) {
  return assetResponse(async () => finishUpload((await currentUser(request)).id, (await context.params).id));
}
