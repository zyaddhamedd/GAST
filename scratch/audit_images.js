require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const publicDir = path.join(process.cwd(), 'public');

  const categories = await prisma.category.findMany();
  console.log('--- Categories ---');
  for (const cat of categories) {
    if (cat.image) {
      const filePath = path.join(publicDir, cat.image);
      const exists = fs.existsSync(filePath);
      console.log(`${exists ? '✅' : '❌'} ${cat.name}: ${cat.image}`);
    } else {
      console.log(`⚠️ ${cat.name}: No image`);
    }
  }

  const products = await prisma.product.findMany({ include: { images: true } });
  console.log('\n--- Products ---');
  for (const prod of products) {
    if (prod.images.length === 0) {
      console.log(`⚠️ ${prod.name}: No images`);
      continue;
    }
    for (const img of prod.images) {
      const filePath = path.join(publicDir, img.url);
      const exists = fs.existsSync(filePath);
      console.log(`${exists ? '✅' : '❌'} ${prod.name}: ${img.url}`);
    }
  }

  await prisma.$disconnect();
  await pool.end();
}

main();
