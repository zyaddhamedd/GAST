async function testAPI() {
  const sites = ['gast', 'ettehad'];
  
  for (const site of sites) {
    console.log(`\n--- Testing Site: ${site.toUpperCase()} ---`);
    const res = await fetch('http://localhost:3001/api/products', {
      headers: { 'x-site': site }
    });
    const products = await res.json();
    console.log(`Found ${products.length} products for ${site}:`);
    products.forEach(p => console.log(` - ${p.name}`));
  }
}

testAPI();
