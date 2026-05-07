const { Client } = require('pg');
const railwayUrl = "postgresql://postgres:RLVGMsxsBVxETQTNmtjTuduXoSSRXyFE@tramway.proxy.rlwy.net:25874/railway";
const client = new Client({ connectionString: railwayUrl });

async function main() {
  try {
    await client.connect();
    const res = await client.query(`
      SELECT p.id, p.name, pi.url 
      FROM "Product" p 
      JOIN "ProductImage" pi ON p.id = pi."productId"
      ORDER BY p.id
    `);
    console.table(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
main();
