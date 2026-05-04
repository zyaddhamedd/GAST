const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres:postgres@localhost:5432/gast_db?schema=public"
  });
  
  try {
    await client.connect();
    console.log('--- DATABASE TABLES CONTENT ---');
    
    const tables = ['Category', 'Product', 'Site'];
    for (const table of tables) {
      const res = await client.query(`SELECT * FROM "${table}"`);
      console.log(`\nTable: ${table} (${res.rows.length} rows)`);
      if (res.rows.length > 0) {
        console.log(JSON.stringify(res.rows, null, 2));
      }
    }
    
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

main();
