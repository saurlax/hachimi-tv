import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { getMigrations } from "better-auth/db/migration";

const directory = resolve(process.env.HACHIMI_DATA_DIR ?? ".local/data");
mkdirSync(directory, { recursive: true });
const database = new DatabaseSync(join(directory, "hachimi.sqlite"));
try {
  const { runMigrations } = await getMigrations({ database });
  await runMigrations();
  console.log("Authentication database migrated.");
} finally {
  database.close();
}
