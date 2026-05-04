import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

async function debugDB() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const user = await prisma.user.findUnique({
    where: { email: 'gast@gast.com' }
  });

  console.log('User in DB:', user ? { 
    id: user.id, 
    email: user.email, 
    siteId: user.siteId,
    pwHash: user.password.substring(0, 10) + '...'
  } : 'NOT FOUND');

  if (user) {
    const match = await bcrypt.compare('1234', user.password);
    console.log('Manual Bcrypt Match (1234):', match);
  }

  await prisma.$disconnect();
}

debugDB();
