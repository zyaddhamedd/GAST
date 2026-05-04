const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    await client.connect();
    const res = await client.query('SELECT * FROM "Site"');
    console.log('SITES:');
    console.log(JSON.stringify(res.rows, null, 2));
    
    const res2 = await client.query('SELECT * FROM "Category"');
    console.log('CATEGORIES:');
    console.log(JSON.stringify(res2.rows, null, 2));
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
