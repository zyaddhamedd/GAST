import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('--- Post-Migration Validation ---');

  // 1. Check Enum values in DB
  try {
    const orders = await prisma.order.findMany({
      select: { id: true, paymentMethod: true },
      take: 5
    });
    console.log('Recent orders payment methods:', JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error('Error checking payment methods:', err);
  }

  // 2. Test Default Value
  try {
    // Get a valid siteId first
    const site = await prisma.site.findFirst();
    if (!site) {
        console.error('No site found to create test order.');
        return;
    }

    const newOrder = await prisma.order.create({
      data: {
        customerName: 'Validation Test',
        phone: '01000000000',
        address: 'Validation Address',
        total: 100,
        siteId: site.id
      }
    });
    console.log('Created test order ID:', newOrder.id, 'Method:', newOrder.paymentMethod);
    
    // Clean up
    await prisma.order.delete({ where: { id: newOrder.id } });
    console.log('Cleaned up test order.');
  } catch (err) {
    console.error('Error testing default value:', err);
  }

  console.log('--- Validation Complete ---');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
