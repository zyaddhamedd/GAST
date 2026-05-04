require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const gast = await prisma.site.upsert({
    where: { slug: 'gast' },
    update: {},
    create: {
      name: 'GAST',
      slug: 'gast',
      domain: 'localhost',
    },
  });

  const ettehad = await prisma.site.upsert({
    where: { slug: 'ettehad' },
    update: {},
    create: {
      name: 'Ettehad',
      slug: 'ettehad',
      domain: 'ettehad.localhost',
    },
  });

  console.log({ gast, ettehad });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
