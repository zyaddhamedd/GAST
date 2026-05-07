import { prisma } from '../src/lib/prisma';

async function traceCategory(slug: string) {
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

  const where: any = {
    category: { slug: normalizedSlug }
  };

  const products = await prisma.product.findMany({
    where,
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
traceCategory(target).catch(console.error);
