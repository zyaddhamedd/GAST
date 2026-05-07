const { Client } = require('pg');
const railwayUrl = "postgresql://postgres:RLVGMsxsBVxETQTNmtjTuduXoSSRXyFE@tramway.proxy.rlwy.net:25874/railway";
const client = new Client({ connectionString: railwayUrl });

async function main() {
  try {
    await client.connect();
    
    console.log('--- LATEST CATEGORIES ---');
    const categories = await client.query('SELECT id, name, slug FROM "Category" ORDER BY "createdAt" DESC LIMIT 10');
    console.table(categories.rows);

    console.log('\n--- LATEST PRODUCTS ---');
    const products = await client.query('SELECT id, name, slug, "categoryId", "createdAt" FROM "Product" ORDER BY "createdAt" DESC LIMIT 10');
    console.table(products.rows);

    console.log('\n--- CHECKING FOR DUPLICATE SLUGS ---');
    const duplicates = await client.query('SELECT slug, COUNT(*) FROM "Product" GROUP BY slug HAVING COUNT(*) > 1');
    console.table(duplicates.rows);

    console.log('\n--- CHECKING FOR PRODUCTS WITHOUT IMAGES OR WRONG IMAGES ---');
    const images = await client.query(`
      SELECT p.id, p.name, pi.url 
      FROM "Product" p 
      LEFT JOIN "ProductImage" pi ON p.id = pi."productId" 
      WHERE p.id IN (SELECT id FROM "Product" ORDER BY "createdAt" DESC LIMIT 5)
    `);
    console.table(images.rows);

  } catch(e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
main();
