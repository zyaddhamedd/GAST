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
    if (cat.image.startsWith('/assets/')) continue;
    
    // Remove /uploads/ and convert extension to webp
    let newPath = cat.image.replace('/uploads/', '').replace(/\.[^/.]+$/, ".webp");
    
    if (newPath !== cat.image) {
        console.log(`Fixing ${cat.name}: ${cat.image} -> ${newPath}`);
        await prisma.category.update({
            where: { id: cat.id },
            data: { image: newPath }
        });
    }
  }

  await prisma.$disconnect();
  await pool.end();
}

main();
