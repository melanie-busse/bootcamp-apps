import { getDb } from "./db.js";

export async function getAllTrails() {
  const db = await getDb();
  return db.all(`
    SELECT trails.*, regions.name as regionName, regions.country 
    FROM trails 
    INNER JOIN regions ON trails.region_id = regions.id
  `);
}

export async function getTrailBySlug(slug: string) {
  const db = await getDb();
  return db.get(
    `
    SELECT trails.*, regions.name as regionName, regions.country 
    FROM trails 
    INNER JOIN regions ON trails.region_id = regions.id 
    WHERE trails.slug = ?
  `,
    [slug],
  );
}

export async function getTrailsByRegionId(regionId: number) {
  const db = await getDb();
  return db.all("SELECT * FROM trails WHERE region_id = ?", [regionId]);
}
