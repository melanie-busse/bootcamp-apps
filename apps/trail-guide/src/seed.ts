import { getDb } from "./models/db.js";
import fs from "fs";
import path from "path";

async function seed() {
  const db = await getDb();
  const sqlPath = path.join(process.cwd(), "data", "seed.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  console.log("Starte Seeding...");
  await db.exec(sql);
  console.log("Daten erfolgreich importiert!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
