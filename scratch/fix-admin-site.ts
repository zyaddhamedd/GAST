import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  
  const site = await prisma.site.findUnique({ where: { slug: 'gast' } });
  console.log('SITE_DATA:', site);
  
  if (site) {
    await prisma.user.update({
      where: { email: 'gast@gast.com' },
      data: { siteId: site.id }
    });
    console.log('User updated with siteId:', site.id);
  }
  
  await prisma.$disconnect();
}

main();
