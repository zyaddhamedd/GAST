const { Client } = require('pg');
const railwayUrl = "postgresql://postgres:RLVGMsxsBVxETQTNmtjTuduXoSSRXyFE@tramway.proxy.rlwy.net:25874/railway";
const client = new Client({ connectionString: railwayUrl });

async function main() {
  try {
    await client.connect();
    const res = await client.query(`
      SELECT table_name, column_name
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND column_name = 'siteId'
      ORDER BY table_name;
    `);
    console.table(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
main();
