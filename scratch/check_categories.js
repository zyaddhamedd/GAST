require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const categories = await prisma.category.findMany();

  console.log('Categories:');
  categories.forEach(c => {
    console.log(`Category: ${c.name} (Slug: ${c.slug})`);
    console.log(`  Image: ${c.image}`);
  });

  await prisma.$disconnect();
  await pool.end();
}

main();
