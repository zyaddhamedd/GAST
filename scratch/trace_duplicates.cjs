const { Client } = require('pg');
const railwayUrl = "postgresql://postgres:RLVGMsxsBVxETQTNmtjTuduXoSSRXyFE@tramway.proxy.rlwy.net:25874/railway";
const client = new Client({ connectionString: railwayUrl });

async function main() {
  try {
    await client.connect();
    const res = await client.query('SELECT id, name, slug, "createdAt" FROM "Product" WHERE name IN (SELECT name FROM "Product" GROUP BY name HAVING COUNT(*) > 1) ORDER BY name, "createdAt"');
    console.table(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
main();
