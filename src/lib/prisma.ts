import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * Prisma Client Singleton with Lazy Extensions
 * Optimized for Next.js 16 and multi-tenant isolation.
 */

let prismaInstance: any = null;
let pool: Pool | null = null;

async function createClient() {
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  const adapter = new PrismaPg(pool);
  
  const basePrisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

  return basePrisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const tenantModels = ['Category', 'Product', 'Order', 'Message', 'SiteConfig'];
          
          if (tenantModels.includes(model)) {
            const { getSiteId } = await import('./site-context');
            const siteId = getSiteId();

            if (siteId) {
              const anyArgs = args as any;
              if (['findMany', 'findFirst', 'findUnique', 'findUniqueOrThrow', 'count', 'aggregate', 'groupBy'].includes(operation)) {
                anyArgs.where = { ...anyArgs.where, siteId };
              }
              if (['create', 'createMany'].includes(operation)) {
                if (operation === 'create') {
                  anyArgs.data = { ...anyArgs.data, siteId };
                } else if (Array.isArray(anyArgs.data)) {
                  anyArgs.data = anyArgs.data.map((d: any) => ({ ...d, siteId }));
                }
              }
              if (['update', 'updateMany', 'delete', 'deleteMany', 'upsert'].includes(operation)) {
                anyArgs.where = { ...anyArgs.where, siteId };
                if (operation === 'upsert') {
                  anyArgs.create = { ...anyArgs.create, siteId };
                  anyArgs.update = { ...anyArgs.update, siteId };
                }
              }
            }
          }
          return query(args);
        },
      },
    },
  });
}

// Proxy to handle lazy initialization
export const prisma = new Proxy({} as any, {
  get(target, prop) {
    if (prop === 'then') return undefined; // Avoid issues with async/await on the proxy itself
    
    if (!prismaInstance) {
      if (!pool) {
        pool = new Pool({ connectionString: process.env.DATABASE_URL });
      }
      const adapter = new PrismaPg(pool);

      const basePrisma = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      });

      prismaInstance = basePrisma.$extends({
        query: {
          $allModels: {
            async $allOperations({ model, operation, args, query }) {
              const tenantModels = ['Category', 'Product', 'Order', 'Message', 'SiteConfig'];
              if (tenantModels.includes(model)) {
                const { getSiteId } = await import('./site-context');
                const siteId = getSiteId();
                if (siteId) {
                  const anyArgs = args as any;
                  let targetOperation = operation;

                  // findUnique/findUniqueOrThrow only allow unique fields in 'where'.
                  // Since siteId is not part of a compound unique index in most models,
                  // we convert these to findFirst/findFirstOrThrow to allow filtering by siteId.
                  if (operation === 'findUnique') {
                    targetOperation = 'findFirst';
                  } else if (operation === 'findUniqueOrThrow') {
                    targetOperation = 'findFirstOrThrow';
                  }

                  if (['findMany', 'findFirst', 'findFirstOrThrow', 'count', 'aggregate', 'groupBy'].includes(targetOperation)) {
                    anyArgs.where = { ...anyArgs.where, siteId };
                  }
                  
                  if (['create', 'createMany'].includes(operation)) {
                    if (operation === 'create') anyArgs.data = { ...anyArgs.data, siteId };
                    else if (Array.isArray(anyArgs.data)) anyArgs.data = anyArgs.data.map((d: any) => ({ ...d, siteId }));
                  }
                  
                  if (['update', 'updateMany', 'delete', 'deleteMany', 'upsert'].includes(operation)) {
                    anyArgs.where = { ...anyArgs.where, siteId };
                    if (operation === 'upsert') {
                      anyArgs.create = { ...anyArgs.create, siteId };
                      anyArgs.update = { ...anyArgs.update, siteId };
                    }
                  }

                  // If we changed the operation, we need to call the query with the new operation
                  if (targetOperation !== operation) {
                    return (prismaInstance[model] as any)[targetOperation](anyArgs);
                  }
                }
              }
              return query(args);
            },
          },
        },
      });
    }
    return prismaInstance[prop];
  },
});
