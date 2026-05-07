const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const railwayUrl = "postgresql://postgres:RLVGMsxsBVxETQTNmtjTuduXoSSRXyFE@tramway.proxy.rlwy.net:25874/railway";
const pool = new Pool({ connectionString: railwayUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function auditRelations() {
  console.log('--- FINAL RELATION AUDIT ---');
  
  const products = await prisma.product.findMany({
    include: { category: true, images: true }
  });

  const categoryCounts = {};
  
  for (const p of products) {
    if (!p.category) {
      console.error(`ORPHAN PRODUCT FOUND: ID=${p.id}, Name=${p.name}`);
    } else {
      categoryCounts[p.category.id] = (categoryCounts[p.category.id] || 0) + 1;
    }

    if (p.images.length === 0) {
      console.warn(`PRODUCT WITH NO IMAGES: ID=${p.id}, Name=${p.name}`);
    }

    // Check for weird data
    if (p.name.includes('\u200B') || p.slug.includes(' ')) {
      console.error(`CORRUPT DATA FOUND: ID=${p.id}, Name='${p.name}', Slug='${p.slug}'`);
    }
  }

  console.log('Category Distribution:', categoryCounts);
  console.log('Total Products:', products.length);
}

auditRelations().catch(console.error).finally(() => { prisma.$disconnect(); pool.end(); });
