const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true }
  });
  console.log('Categories:', JSON.stringify(categories, null, 2));
  
  const products = await prisma.product.findMany({
    take: 5,
    select: { id: true, name: true, slug: true, categoryId: true }
  });
  console.log('Sample Products:', JSON.stringify(products, null, 2));
  
  await prisma.$disconnect();
}

check();
