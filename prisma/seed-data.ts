import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Get sites
  const gast = await prisma.site.findUnique({ where: { slug: 'gast' } });
  const ettehad = await prisma.site.findUnique({ where: { slug: 'ettehad' } });

  if (!gast || !ettehad) {
    console.log('Sites not found. Please run seed-sites.js first.');
    return;
  }

  // 2. Create Categories for GAST
  const cat1 = await prisma.category.upsert({
    where: { slug: 'solar-panels' },
    update: {},
    create: {
      name: 'Solar Panels',
      slug: 'solar-panels',
      image: '/uploads/solar.jpg',
      siteId: gast.id,
    },
  });

  const cat2 = await prisma.category.upsert({
    where: { slug: 'batteries' },
    update: {},
    create: {
      name: 'Batteries',
      slug: 'batteries',
      image: '/uploads/battery.jpg',
      siteId: gast.id,
    },
  });

  // 3. Create Products for GAST
  await prisma.product.createMany({
    data: [
      {
        name: 'GAST Solar Panel 450W',
        slug: 'gast-solar-panel-450w',
        description: 'High efficiency solar panel',
        price: 1200,
        categoryId: cat1.id,
        siteId: gast.id,
        inStock: true,
      },
      {
        name: 'GAST Battery 200Ah',
        slug: 'gast-battery-200ah',
        description: 'Deep cycle gel battery',
        price: 3500,
        categoryId: cat2.id,
        siteId: gast.id,
        inStock: true,
      }
    ]
  });

  // 4. Create Categories for Ettehad
  const cat3 = await prisma.category.upsert({
    where: { slug: 'generators' },
    update: {},
    create: {
      name: 'Generators',
      slug: 'generators',
      image: '/uploads/gen.jpg',
      siteId: ettehad.id,
    },
  });

  // 5. Create Products for Ettehad
  await prisma.product.createMany({
    data: [
      {
        name: 'Ettehad Generator 5KVA',
        slug: 'ettehad-generator-5kva',
        description: 'Silent diesel generator',
        price: 15000,
        categoryId: cat3.id,
        siteId: ettehad.id,
        inStock: true,
      },
      {
        name: 'Ettehad Generator 10KVA',
        slug: 'ettehad-generator-10kva',
        description: 'Powerful silent generator',
        price: 25000,
        categoryId: cat3.id,
        siteId: ettehad.id,
        inStock: true,
      },
      {
        name: 'Ettehad Controller',
        slug: 'ettehad-controller',
        description: 'ATS Controller for generators',
        price: 800,
        categoryId: cat3.id,
        siteId: ettehad.id,
        inStock: true,
      }
    ]
  });

  console.log('Seed data inserted successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
