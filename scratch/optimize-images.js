const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DIRS = ['public/assets', 'public/uploads'];

async function optimizeDir(dir) {
  console.log(`Scanning directory: ${dir}`);
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    if (!/\.(png|jpg|jpeg)$/i.test(file)) continue;

    const inputPath = path.join(dir, file);
    const stats = fs.statSync(inputPath);
    
    // Only optimize if > 200KB as requested
    if (stats.size < 200 * 1024) continue;

    const outputName = file.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const outputPath = path.join(dir, outputName);

    const sizeBeforeKB = (stats.size / 1024).toFixed(2);

    try {
      // Determine target width based on filename or just use default 1200
      let width = 1200;
      if (file.includes('هيرو') || file.includes('hero')) width = 1920;
      if (file.includes('logo')) width = 600;

      let buffer = await sharp(inputPath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toBuffer();

      // Ensure < 150KB as requested
      if (buffer.length > 150 * 1024) {
        buffer = await sharp(inputPath)
          .resize({ width: Math.min(width, 1280), withoutEnlargement: true })
          .webp({ quality: 50 })
          .toBuffer();
      }

      fs.writeFileSync(outputPath, buffer);

      const statsAfter = fs.statSync(outputPath);
      const sizeAfterKB = (statsAfter.size / 1024).toFixed(2);

      console.log(`Optimized: ${file} -> ${outputName}`);
      console.log(`  Size: ${sizeBeforeKB} KB -> ${sizeAfterKB} KB (${((1 - statsAfter.size / stats.size) * 100).toFixed(1)}% reduction)`);
      
    } catch (err) {
      console.error(`Error optimizing ${file}:`, err.message);
    }
  }
}

async function main() {
  for (const dir of DIRS) {
    if (fs.existsSync(dir)) {
      await optimizeDir(dir);
    }
  }
  console.log('Optimization complete.');
}

main();
