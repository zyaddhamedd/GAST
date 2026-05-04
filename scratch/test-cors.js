async function testCORS() {
  const url = 'http://localhost:3001/api/products';
  
  console.log('--- Testing OPTIONS (Preflight) ---');
  const optionsRes = await fetch(url, {
    method: 'OPTIONS',
    headers: {
      'Origin': 'http://localhost:3000',
      'Access-Control-Request-Method': 'GET',
      'Access-Control-Request-Headers': 'x-site'
    }
  });
  
  console.log('Status:', optionsRes.status);
  console.log('Allow-Origin:', optionsRes.headers.get('access-control-allow-origin'));
  console.log('Allow-Methods:', optionsRes.headers.get('access-control-allow-methods'));
  console.log('Allow-Headers:', optionsRes.headers.get('access-control-allow-headers'));

  console.log('\n--- Testing GET with Origin ---');
  const getRes = await fetch(url, {
    headers: {
      'Origin': 'http://localhost:3000',
      'x-site': 'ettehad'
    }
  });
  
  console.log('Status:', getRes.status);
  console.log('Allow-Origin:', getRes.headers.get('access-control-allow-origin'));
}

testCORS();
