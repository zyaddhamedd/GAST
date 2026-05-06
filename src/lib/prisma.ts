import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * Standard Production Prisma Client
 * Removed all multi-tenancy / site-isolation logic as requested.
 * Optimized for single-site stability.
 */

let prismaInstance: PrismaClient | null = null;
let pool: Pool | null = null;

export const prisma = new Proxy({} as any, {
  get(target, prop) {
    if (prop === 'then') return undefined;
    
    if (!prismaInstance) {
      if (!pool) {
        pool = new Pool({ connectionString: process.env.DATABASE_URL });
      }
      const adapter = new PrismaPg(pool);

      prismaInstance = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      });
    }

    return (prismaInstance as any)[prop];
  },
});
