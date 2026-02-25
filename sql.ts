import { sql } from "bun";
import { Log } from "./log";

Log.log("Reading tables file...");
const file = Bun.file("tables.sql");
const tables = await file.text();
Log.log("File parsed, generating SQL tables...");
await sql.unsafe(tables);
Log.log("Tables generated succesfully.");
