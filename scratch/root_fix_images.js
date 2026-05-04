const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  const files = fs.readdirSync(uploadsDir);

  console.log(`Processing ${files.length} files in ${uploadsDir}...`);

  const fileMap = new Map(); // originalName -> webpName

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file, ext);
    const fullPath = path.join(uploadsDir, file);

    if (['.jpg', '.jpeg', '.png', '.gif', '.jfif'].includes(ext)) {
      const webpName = `${baseName}.webp`;
      const webpPath = path.join(uploadsDir, webpName);

      try {
        console.log(`Converting ${file} to WebP...`);
        await sharp(fullPath).webp().toFile(webpPath);
        fileMap.set(file, webpName);
        fileMap.set(baseName + ext, webpName); // Just in case
        
        // Only delete if the name actually changed or it's a different extension
        if (file !== webpName) {
            fs.unlinkSync(fullPath);
            console.log(`Deleted original: ${file}`);
        }
      } catch (err) {
        console.error(`Failed to convert ${file}:`, err.message);
      }
    } else if (ext === '.webp') {
      fileMap.set(file, file);
    }
  }

  // Helper to normalize path to just filename
  const getJustFilename = (p) => {
    if (!p) return null;
    const parts = p.split('/');
    return parts[parts.length - 1];
  };

  // Audit Categories
  const categories = await prisma.category.findMany();
  for (const cat of categories) {
    const filename = getJustFilename(cat.image);
    if (!filename) continue;

    let newFilename = fileMap.get(filename) || filename;
    
    // Check if it's in assets
    if (cat.image.startsWith('/assets/')) {
        // Keep assets as they are, but maybe normalize to relative path if requested?
        // User said "Ensure DB stores: filename ONLY".
        // But assets are different. I'll leave assets alone or just store the full path if it's /assets/.
        continue; 
    }

    if (newFilename !== filename || cat.image.includes('/')) {
        console.log(`Updating Category ${cat.name}: ${cat.image} -> ${newFilename}`);
        await prisma.category.update({
            where: { id: cat.id },
            data: { image: newFilename }
        });
    }
  }

  // Audit ProductImages
  const productImages = await prisma.productImage.findMany();
  for (const img of productImages) {
    const filename = getJustFilename(img.url);
    if (!filename) continue;

    let newFilename = fileMap.get(filename) || filename;

    if (newFilename !== filename || img.url.includes('/')) {
        console.log(`Updating Product Image ${img.id}: ${img.url} -> ${newFilename}`);
        await prisma.productImage.update({
            where: { id: img.id },
            data: { url: newFilename }
        });
    }
  }

  console.log('Audit and Fix complete.');
  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
