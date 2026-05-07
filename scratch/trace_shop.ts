import { getShopProducts } from '../src/lib/dal';

async function traceShopPayload() {
  console.log('--- TRACING SHOP PAYLOAD (getShopProducts) ---');
  
  const data = await getShopProducts({});
  console.log(`Total Count: ${data.totalCount}`);
  
  data.products.forEach(p => {
    console.log(`Product ID: ${p.id} | Name: ${p.name} | Slug: ${p.slug}`);
    console.log(`Images:`, p.images);
    console.log('---');
  });
}

traceShopPayload().catch(console.error);
