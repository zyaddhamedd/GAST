const { Client } = require('pg');
const railwayUrl = "postgresql://postgres:RLVGMsxsBVxETQTNmtjTuduXoSSRXyFE@tramway.proxy.rlwy.net:25874/railway";
const client = new Client({ connectionString: railwayUrl });

async function main() {
  try {
    await client.connect();
    // Find products created within 5 seconds of each other
    const res = await client.query(`
      SELECT p1.id as id1, p1.name as name1, p1.slug as slug1, p1."createdAt" as created1,
             p2.id as id2, p2.name as name2, p2.slug as slug2, p2."createdAt" as created2
      FROM "Product" p1
      JOIN "Product" p2 ON p1.id < p2.id AND p1.name = p2.name
      WHERE ABS(EXTRACT(EPOCH FROM (p1."createdAt" - p2."createdAt"))) < 30
    `);
    console.table(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
main();
