require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const categories = await prisma.category.findMany();
  console.log('--- Categories in DB ---');
  categories.forEach(c => {
    console.log(`- ${c.name}: "${c.image}"`);
  });

  await prisma.$disconnect();
  await pool.end();
}

main();
