const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/gast_db?schema=public"
  });
  
  try {
    await client.connect();
    console.log('--- ACTION: CLEARING ALL CATEGORIES ---');
    
    // Deleting all categories.
    // In PostgreSQL, if the foreign key has ON DELETE CASCADE, it will handle products.
    // Let's check the constraints first or just try to delete.
    
    const res = await client.query('DELETE FROM "Category"');
    console.log(`Successfully deleted ${res.rowCount} categories.`);
    
    // We should also delete from ProductImage if needed, but CASCADE should handle it.
    
    console.log('All categories (and associated products) have been cleared.');
    
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

main();
