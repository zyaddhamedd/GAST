const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/gast_db?schema=public"
  });
  
  try {
    await client.connect();
    console.log('--- DATABASE DIAGNOSTIC: CATEGORIES ---');
    
    const res = await client.query('SELECT * FROM "Category" ORDER BY "createdAt" DESC');
    console.log(`Total categories in DB: ${res.rows.length}`);
    res.rows.forEach(cat => {
      console.log(`ID: ${cat.id} | Name: ${cat.name} | Slug: ${cat.slug} | Image: ${cat.image} | SiteId: ${cat.siteId} | CreatedAt: ${cat.createdAt}`);
    });
    
    const res2 = await client.query('SELECT count(*) FROM "Product"');
    console.log(`\nTotal products in DB: ${res2.rows[0].count}`);
    
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

main();
