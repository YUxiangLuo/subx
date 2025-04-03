import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

export const bun_db = new Database(process.env.PWD + "/sqlite.db");
bun_db
  .query(
    `create table if not exists subs (id INTEGER PRIMARY KEY, url TEXT, nodes TEXT, update_time TEXT)`,
  )
  .run();
export const drizzle_db = drizzle({ client: bun_db });
