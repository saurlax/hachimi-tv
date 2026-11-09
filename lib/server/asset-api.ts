import "server-only";
import { auth } from "./auth";

export class AssetError extends Error {
  constructor(public code: string, public status: number) { super(code); }
}
export async function currentUser(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw new AssetError("unauthenticated", 401);
  return session.user;
}
export async function assetResponse(action: () => Promise<unknown>) {
  try { return Response.json(await action(), { headers: { "Cache-Control": "no-store" } }); }
  catch (error) {
    if (error instanceof AssetError) return Response.json({ error: error.code }, { status: error.status });
    const failure = error as { name?: string; $metadata?: { httpStatusCode?: number } };
    console.error("Asset storage request failed", failure.name, failure.$metadata?.httpStatusCode);
    return Response.json({ error: "storage_failed" }, { status: 502 });
  }
}
export async function objectBody(request: Request): Promise<Record<string, unknown>> {
  const body = await request.json().catch(() => { throw new AssetError("invalid_request", 400); });
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new AssetError("invalid_request", 400);
  return body;
}
