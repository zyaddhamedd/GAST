import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function cleanupDatabase() {
  console.log('🚀 Starting Database Image Path Cleanup...');

  try {
    // 1. Cleanup Category Images
    const categories = await prisma.category.findMany();
    for (const cat of categories) {
      if (cat.image) {
        const filename = cat.image.split('/').pop() || '';
        await prisma.category.update({
          where: { id: cat.id },
          data: { image: filename }
        });
        console.log(`✅ Category [${cat.name}]: ${cat.image} -> ${filename}`);
      }
    }

    // 2. Cleanup Product Images
    const productImages = await prisma.productImage.findMany();
    for (const img of productImages) {
      if (img.url) {
        const filename = img.url.split('/').pop() || '';
        await prisma.productImage.update({
          where: { id: img.id },
          data: { url: filename }
        });
        console.log(`✅ Product Image [ID: ${img.id}]: ${img.url} -> ${filename}`);
      }
    }

    console.log('✨ Database Cleanup Completed Successfully.');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDatabase();
