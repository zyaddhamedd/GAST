const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const railwayUrl = "postgresql://postgres:RLVGMsxsBVxETQTNmtjTuduXoSSRXyFE@tramway.proxy.rlwy.net:25874/railway";
const pool = new Pool({ connectionString: railwayUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function traceCategory(slug) {
  console.log(`Tracing Category: ${slug}`);
  const normalizedSlug = slug.normalize('NFC');
  console.log(`Normalized Slug: ${normalizedSlug}`);

  const category = await prisma.category.findUnique({
    where: { slug: normalizedSlug }
  });

  if (!category) {
    console.log('Category NOT FOUND in DB');
    return;
  }

  console.log('Category Found:', category);

  const products = await prisma.product.findMany({
    where: {
      category: { slug: normalizedSlug }
    },
    select: { id: true, name: true, slug: true }
  });

  console.log(`Products found with where.category.slug: ${products.length}`);
  console.table(products);

  const productsById = await prisma.product.findMany({
    where: { categoryId: category.id },
    select: { id: true, name: true, slug: true }
  });

  console.log(`Products found with where.categoryId: ${productsById.length}`);
  console.table(productsById);
}

const target = process.argv[2] || 'توتو';
traceCategory(target)
  .catch(console.error)
  .finally(() => {
    prisma.$disconnect();
    pool.end();
  });
