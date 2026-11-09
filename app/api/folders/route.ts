import { assetResponse, currentUser, objectBody } from "@/lib/server/asset-api";
import { createFolder } from "@/lib/server/assets";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return assetResponse(async () => createFolder((await currentUser(request)).id, await objectBody(request)));
}
