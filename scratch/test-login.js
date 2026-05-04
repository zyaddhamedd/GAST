async function testLogin() {
  const res = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'gast@gast.com', password: '1234' })
  });
  
  const data = await res.json();
  console.log('Login Response:', res.status, data);
}

testLogin();
