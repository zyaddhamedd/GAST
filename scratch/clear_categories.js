const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- CLEARING ALL CATEGORIES ---');
  try {
    // Delete all categories. 
    // Note: Due to onDelete: Cascade in schema.prisma, this will also delete all associated products.
    const deleted = await prisma.category.deleteMany({});
    console.log(`Successfully deleted ${deleted.count} categories.`);
    
    console.log('Categories cleared. Please note that associated products were also deleted due to Cascade rules.');
  } catch (error) {
    console.error('Error clearing categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
