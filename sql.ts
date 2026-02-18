import { sql } from "bun";

console.log("Reading tables file...");
const file = Bun.file("tables.sql");
const tables = await file.text();
console.log("File parsed, generating SQL tables...");
await sql.unsafe(tables);
console.log("Tables generated succesfully.");
