const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- DATABASE DIAGNOSTIC: CATEGORIES ---');
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Total categories in DB: ${categories.length}`);
    categories.forEach(cat => {
      console.log(`ID: ${cat.id} | Name: ${cat.name} | Slug: ${cat.slug} | Image: ${cat.image} | CreatedAt: ${cat.createdAt}`);
    });
    
    const products = await prisma.product.findMany({
      select: { id: true, name: true, categoryId: true }
    });
    console.log(`\nTotal products in DB: ${products.length}`);
    
  } catch (error) {
    console.error('Error querying DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
