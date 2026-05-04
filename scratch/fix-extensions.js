const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/app/faq/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/checkout/page.tsx',
  'src/app/shop/page.tsx',
  'src/app/order-success/page.tsx',
  'src/app/product/[id]/page.tsx'
];

filesToFix.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/\.png/g, '.webp');
    content = content.replace(/\.jpg/g, '.webp');
    fs.writeFileSync(fullPath, content);
    console.log(`Updated: ${file}`);
  } else {
    console.warn(`File not found: ${file}`);
  }
});
