require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const categories = await prisma.category.findMany();
  for (const cat of categories) {
    if (cat.image && !cat.image.startsWith('/')) {
      console.log(`Fixing Category ${cat.name}: ${cat.image} -> /${cat.image}`);
      await prisma.category.update({
        where: { id: cat.id },
        data: { image: `/${cat.image}` }
      });
    }
    // Also fix the 404 ones for demonstration
    if (cat.image === '/uploads/solar.webp') {
        await prisma.category.update({ where: { id: cat.id }, data: { image: '/assets/cat1.webp' } });
    }
    if (cat.image === '/uploads/battery.webp') {
        await prisma.category.update({ where: { id: cat.id }, data: { image: '/assets/cat2.webp' } });
    }
  }

  const prodImages = await prisma.productImage.findMany();
  for (const img of prodImages) {
    if (img.url && !img.url.startsWith('/')) {
      console.log(`Fixing Product Image ${img.id}: ${img.url} -> /${img.url}`);
      await prisma.productImage.update({
        where: { id: img.id },
        data: { url: `/${img.url}` }
      });
    }
  }

  await prisma.$disconnect();
  await pool.end();
}

main();
