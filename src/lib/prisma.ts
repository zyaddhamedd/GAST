import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * Professional Prisma Client Singleton
 * Features: 
 * - Multi-tenant isolation via siteId injection
 * - Automatic conversion of findUnique to findFirst for site-aware lookups
 * - Recursion-safe implementation
 * - Lazy initialization for optimal serverless/edge performance
 */

let prismaInstance: any = null;
let basePrisma: PrismaClient | null = null;
let pool: Pool | null = null;

export const prisma = new Proxy({} as any, {
  get(target, prop) {
    if (prop === 'then') return undefined;
    
    if (!prismaInstance) {
      if (!pool) {
        pool = new Pool({ connectionString: process.env.DATABASE_URL });
      }
      const adapter = new PrismaPg(pool);

      basePrisma = new PrismaClient({
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
                const siteId = getSiteId() || 1; // Force fallback to GAST (Site ID 1) for single-site stabilization

                if (siteId) {
                  const anyArgs = args as any;

                  // 1. Handle findUnique/findUniqueOrThrow conversion to findFirst
                  // This is necessary because siteId is not part of the primary/unique keys,
                  // and Prisma findUnique only allows unique fields.
                  if (operation === 'findUnique' || operation === 'findUniqueOrThrow') {
                    const targetOp = operation === 'findUnique' ? 'findFirst' : 'findFirstOrThrow';
                    anyArgs.where = { ...anyArgs.where, siteId };
                    
                    // CRITICAL: Call the base client to avoid infinite recursion
                    return (basePrisma![model as any] as any)[targetOp](anyArgs);
                  }

                  // 2. Inject siteId for Read operations
                  if (['findMany', 'findFirst', 'count', 'aggregate', 'groupBy'].includes(operation)) {
                    anyArgs.where = { ...anyArgs.where, siteId };
                  }
                  
                  // 3. Inject siteId for Write operations
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
              
              // For all other cases, or if no siteId is present, use standard query
              return query(args);
            },
          },
        },
      });
    }

    return prismaInstance[prop];
  },
});
