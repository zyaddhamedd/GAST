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
  const uploadsDir = path.join(publicDir, 'uploads');

  const checkFile = (filename) => {
    if (!filename) return { exists: false, reason: 'Empty' };
    if (filename.startsWith('/assets/')) {
        return { exists: fs.existsSync(path.join(publicDir, filename)), reason: 'Asset' };
    }
    // If it's just a filename, check in uploads
    const fullPath = path.join(uploadsDir, filename);
    return { exists: fs.existsSync(fullPath), reason: 'Upload' };
  };

  const categories = await prisma.category.findMany();
  console.log('--- Categories ---');
  for (const cat of categories) {
    const { exists, reason } = checkFile(cat.image);
    console.log(`${exists ? '✅' : '❌'} ${cat.name}: ${cat.image} (${reason})`);
  }

  const products = await prisma.product.findMany({ include: { images: true } });
  console.log('\n--- Products ---');
  for (const prod of products) {
    if (prod.images.length === 0) {
      console.log(`⚠️ ${prod.name}: No images`);
      continue;
    }
    for (const img of prod.images) {
      const { exists, reason } = checkFile(img.url);
      console.log(`${exists ? '✅' : '❌'} ${prod.name}: ${img.url} (${reason})`);
    }
  }

  await prisma.$disconnect();
  await pool.end();
}

main();
