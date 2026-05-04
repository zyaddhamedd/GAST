import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
  try {
    const sites = await prisma.site.findMany();
    console.log('Sites:');
    sites.forEach((s: any) => console.log(`- ID: ${s.id}, Slug: ${s.slug}, Domain: ${s.domain}`));

    const categories = await prisma.category.findMany();
    console.log('\nCategories:');
    categories.forEach((c: any) => console.log(`- SiteID: ${c.siteId}, Name: ${c.name}, Image: ${c.image}`));

    const products = await prisma.product.findMany({
      include: { images: true }
    });
    console.log('\nProducts:');
    products.forEach((p: any) => {
      console.log(`- SiteID: ${p.siteId}, Name: ${p.name}, Images: ${p.images.map((img: any) => img.url).join(', ')}`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    if (prisma.$disconnect) await prisma.$disconnect();
  }
}

main();
