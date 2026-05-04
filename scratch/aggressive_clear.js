const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/gast_db?schema=public"
  });
  
  try {
    await client.connect();
    console.log('--- AGGRESSIVE CLEARING ---');
    
    // Disable triggers to avoid cascade issues if needed, but CASCADE is better
    await client.query('TRUNCATE TABLE "ProductImage" CASCADE');
    await client.query('TRUNCATE TABLE "Product" CASCADE');
    await client.query('TRUNCATE TABLE "Category" CASCADE');
    await client.query('TRUNCATE TABLE "OrderItem" CASCADE');
    await client.query('TRUNCATE TABLE "Order" CASCADE');
    
    console.log('All categories, products, images, and orders have been cleared.');
    
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

main();
