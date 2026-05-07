const { getShopProducts } = require('../src/lib/dal');

async function verifyCacheStability() {
  console.log('--- PHASE 5: VERIFY FILTER CONSISTENCY ---');
  
  const combos = [
    { name: 'Default', params: {} },
    { name: 'Power 1 HP', params: { power: ['1 HP'] } },
    { name: 'Power 1.5 HP', params: { power: ['1.5 HP'] } },
    { name: 'Voltage 220V', params: { voltage: ['220V'] } },
    { name: 'Combo (1.5 HP + 220V)', params: { power: ['1.5 HP'], voltage: ['220V'] } }
  ];

  for (const combo of combos) {
    console.log(`\nTesting: ${combo.name}`);
    const data = await getShopProducts(combo.params);
    console.log(`Products Found: ${data.totalCount}`);
    if (data.products.length > 0) {
      console.log(`First Product: ID=${data.products[0].id}, Name='${data.products[0].name}'`);
      console.log(`Attributes: Power=${data.products[0].power}, Voltage=${data.products[0].voltage}`);
    }
  }

  console.log('\nVerification Complete.');
}

verifyCacheStability().catch(console.error);
