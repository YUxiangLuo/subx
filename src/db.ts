import { Database } from "bun:sqlite";

export const db = new Database(import.meta.dir + "/../sqlite.db");
db
  .query(
    `create table if not exists subs (id INTEGER PRIMARY KEY, url TEXT, nodes TEXT, update_time TEXT)`,
  )
  .run();