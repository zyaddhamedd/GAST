const { getShopProducts } = require('../src/lib/dal');

async function testCacheCollision() {
  console.log('--- TESTING CACHE PERSISTENCE ---');
  
  // Call 1
  console.log('Call 1 (empty params)...');
  const res1 = await getShopProducts({});
  const p1 = res1.products[0];
  console.log(`P1: ID=${p1.id}, Name=${p1.name}, Image=${p1.image}`);

  // Simulate change (we can't really do this without mutation, but let's see if calling with different keys works)
  console.log('Call 2 (category=all)...');
  const res2 = await getShopProducts({ category: 'all' });
  const p2 = res2.products[0];
  console.log(`P2: ID=${p2.id}, Name=${p2.name}, Image=${p2.image}`);

  if (p1.id === p2.id && p1.image !== p2.image) {
    console.error('CRITICAL ERROR: Identical ID but different images returned for different keys!');
  } else {
    console.log('No immediate collision detected between {} and {category:all}');
  }
}

testCacheCollision().catch(console.error);
