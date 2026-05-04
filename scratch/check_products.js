require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const products = await prisma.product.findMany({
    include: { images: true }
  });

  console.log('Products:');
  products.forEach(p => {
    console.log(`Product: ${p.name}`);
    p.images.forEach(img => {
      console.log(`  Image: ${img.url}`);
    });
  });

  await prisma.$disconnect();
  await pool.end();
}

main();
