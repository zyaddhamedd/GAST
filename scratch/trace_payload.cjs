const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const railwayUrl = "postgresql://postgres:RLVGMsxsBVxETQTNmtjTuduXoSSRXyFE@tramway.proxy.rlwy.net:25874/railway";
const pool = new Pool({ connectionString: railwayUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function traceEdit(productId, newData) {
  console.log(`--- TRACING EDIT FOR PRODUCT ID: ${productId} ---`);
  
  const before = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true }
  });
  console.log('BEFORE DB STATE:', JSON.stringify(before, null, 2));

  console.log('UPDATING WITH:', JSON.stringify(newData, null, 2));
  
  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      ...newData,
      images: newData.images ? {
        deleteMany: {},
        create: newData.images.map(url => ({ url }))
      } : undefined
    },
    include: { images: true }
  });

  console.log('AFTER DB STATE:', JSON.stringify(updated, null, 2));
}

// Example: Edit product 30
traceEdit(30, {
  name: "كموووووووطططاااا UPDATED",
  slug: "updated-slug-test",
  images: ["https://example.com/new-image.jpg"]
}).catch(console.error).finally(() => { prisma.$disconnect(); pool.end(); });
