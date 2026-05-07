const { Client } = require('pg');
const railwayUrl = "postgresql://postgres:RLVGMsxsBVxETQTNmtjTuduXoSSRXyFE@tramway.proxy.rlwy.net:25874/railway";

async function normalize(text) {
  if (!text) return text;
  return text.trim().normalize('NFC');
}

async function main() {
  const client = new Client({ connectionString: railwayUrl });
  try {
    await client.connect();
    
    console.log('--- PHASE 1: DATABASE NORMALIZATION ---');

    // 1. Categories
    const categories = await client.query('SELECT id, name, slug FROM "Category"');
    for (const cat of categories.rows) {
      const normalizedSlug = await normalize(cat.slug);
      if (normalizedSlug !== cat.slug) {
        console.log(`Normalizing Category ID ${cat.id}: '${cat.slug}' -> '${normalizedSlug}'`);
        await client.query('UPDATE "Category" SET slug = $1 WHERE id = $2', [normalizedSlug, cat.id]);
      }
    }

    // 2. Products
    const products = await client.query('SELECT id, name, slug FROM "Product"');
    for (const prod of products.rows) {
      const normalizedSlug = await normalize(prod.slug);
      if (normalizedSlug !== prod.slug) {
        console.log(`Normalizing Product ID ${prod.id}: '${prod.slug}' -> '${normalizedSlug}'`);
        await client.query('UPDATE "Product" SET slug = $1 WHERE id = $2', [normalizedSlug, prod.id]);
      }
    }

    console.log('Normalization complete.');

  } catch(e) {
    console.error('FAILED:', e);
  } finally {
    await client.end();
  }
}

main();
