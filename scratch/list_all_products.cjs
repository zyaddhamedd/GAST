const { Client } = require('pg');
const railwayUrl = "postgresql://postgres:RLVGMsxsBVxETQTNmtjTuduXoSSRXyFE@tramway.proxy.rlwy.net:25874/railway";
const client = new Client({ connectionString: railwayUrl });

async function main() {
  try {
    await client.connect();
    const res = await client.query('SELECT id, name, slug FROM "Product" ORDER BY name');
    console.table(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
main();
