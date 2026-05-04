import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient({ adapter: new PrismaPg(new pg.Pool({ connectionString: process.env.DATABASE_URL })) });

async function main() {
  const cats = await prisma.category.findMany({ select: { name: true, image: true } });
  console.log(JSON.stringify(cats, null, 2));
}
main().finally(() => prisma.$disconnect());
