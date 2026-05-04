
import * as dotenv from 'dotenv';
dotenv.config();
import { prisma } from '../src/lib/prisma';

async function main() {
  try {
    const sites = await prisma.site.findMany({ take: 1 });
    const products = await prisma.product.findMany({ 
      take: 1,
      include: { images: true }
    });
    const categories = await prisma.category.findMany({ take: 1 });

    console.log('--- SITE ---');
    console.log(JSON.stringify(sites, null, 2));
    console.log('--- PRODUCT ---');
    console.log(JSON.stringify(products, null, 2));
    console.log('--- CATEGORY ---');
    console.log(JSON.stringify(categories, null, 2));
  } catch (err) {
    console.error('Error fetching data:', err);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
