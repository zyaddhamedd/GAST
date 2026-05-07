const { Client } = require('pg');
const railwayUrl = "postgresql://postgres:RLVGMsxsBVxETQTNmtjTuduXoSSRXyFE@tramway.proxy.rlwy.net:25874/railway";

async function main() {
  const client = new Client({ connectionString: railwayUrl });
  try {
    await client.connect();
    
    console.log('--- PHASE 5: CATEGORY PAGE STABILIZATION VERIFICATION ---');
    const res = await client.query(`
      SELECT c.id, c.name, c.slug, COUNT(p.id) as product_count
      FROM "Category" c
      LEFT JOIN "Product" p ON c.id = p."categoryId"
      GROUP BY c.id, c.name, c.slug
      ORDER BY c.id
    `);
    
    for (const row of res.rows) {
      console.log(`Category: ${row.name} (Slug: '${row.slug}') -> ${row.product_count} products`);
      if (row.slug.trim() !== row.slug) {
        console.error(`FAILED: Slug '${row.slug}' still has untrimmed characters!`);
      }
    }

    console.log('\n--- PHASE 6: PRODUCT DATA VERIFICATION ---');
    const products = await client.query('SELECT id, name, slug FROM "Product" ORDER BY "createdAt" DESC LIMIT 5');
    console.table(products.rows);

  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

main();
