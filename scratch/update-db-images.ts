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
  console.log('Updating database image paths to .webp...');

  // Update Categories
  const categories = await prisma.category.findMany();
  for (const cat of categories) {
    if (cat.image && (cat.image.endsWith('.png') || cat.image.endsWith('.jpg') || cat.image.endsWith('.jpeg'))) {
      const newPath = cat.image.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      await prisma.category.update({
        where: { id: cat.id },
        data: { image: newPath }
      });
      console.log(`Updated Category ${cat.name}: ${cat.image} -> ${newPath}`);
    }
  }

  // Update Products
  const products = await prisma.product.findMany();
  for (const prod of products) {
      // Products might have multiple images if there's a relation, let's check
      // Based on previous findings, products have a relation to 'ProductImage'
  }
  
  // Update ProductImages
  const productImages = await prisma.productImage.findMany();
  for (const img of productImages) {
    if (img.url && (img.url.endsWith('.png') || img.url.endsWith('.jpg') || img.url.endsWith('.jpeg'))) {
      const newUrl = img.url.replace(/\.(png|jpg|jpeg)$/i, '.webp');
      await prisma.productImage.update({
        where: { id: img.id },
        data: { url: newUrl }
      });
      console.log(`Updated ProductImage: ${img.url} -> ${newUrl}`);
    }
  }

  console.log('Database update complete.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
