const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    await client.connect();
    console.log('--- CONNECTED TO:', process.env.DATABASE_URL);
    
    const res = await client.query('SELECT * FROM "Category"');
    console.log(`TOTAL CATEGORIES: ${res.rows.length}`);
    res.rows.forEach(r => console.log(`- ${r.name} (${r.slug})`));
    
  } catch (err) {
    console.error('DATABASE ERROR:', err.message);
  } finally {
    await client.end();
  }
}

main();
