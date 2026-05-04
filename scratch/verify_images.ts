
import * as dotenv from 'dotenv';
dotenv.config();
import { prisma } from '../src/lib/prisma';

async function main() {
  try {
    const productImages = await prisma.productImage.findMany({ take: 1 });
    console.log('--- PRODUCT IMAGES ---');
    console.log(JSON.stringify(productImages, null, 2));
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
