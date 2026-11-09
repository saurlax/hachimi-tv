import "server-only";
import { mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { DatabaseSync } from "node:sqlite";

const dataDir = resolve(/* turbopackIgnore: true */ process.env.HACHIMI_DATA_DIR ?? ".local/data");
mkdirSync(dataDir, { recursive: true });
const globalDatabase = globalThis as typeof globalThis & { hachimiDatabase?: DatabaseSync };
export const database = globalDatabase.hachimiDatabase ??= new DatabaseSync(join(dataDir, "hachimi.sqlite"));
database.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS media_asset (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    content_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    object_key TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS media_asset_user ON media_asset(user_id, status);
  CREATE TABLE IF NOT EXISTS asset_folder (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
    parent_id TEXT REFERENCES asset_folder(id),
    name TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS asset_folder_parent ON asset_folder(user_id, parent_id);
  CREATE TABLE IF NOT EXISTS asset_quota (
    user_id TEXT PRIMARY KEY REFERENCES user(id) ON DELETE CASCADE,
    limit_bytes INTEGER NOT NULL DEFAULT 10000000000
  );
`);
const columns = database.prepare("PRAGMA table_info(media_asset)").all() as { name: string }[];
for (const [name, type] of Object.entries({ folder_id: "TEXT", upload_id: "TEXT", expires_at: "INTEGER" })) {
  if (!columns.some((column) => column.name === name)) database.exec(`ALTER TABLE media_asset ADD COLUMN ${name} ${type}`);
}
