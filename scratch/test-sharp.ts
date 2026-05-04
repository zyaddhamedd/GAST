import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

async function testSharp() {
  try {
    console.log('Testing sharp...');
    const input = Buffer.from('RIFF_test_webp_data'); // Fake data just to see if it loads
    // Better: use a real file if possible
    const testFile = path.join(process.cwd(), 'public', 'placeholder.webp');
    if (fs.existsSync(testFile)) {
      const buffer = fs.readFileSync(testFile);
      const metadata = await sharp(buffer).metadata();
      console.log('Sharp metadata for placeholder.webp:', metadata);
      
      const outPath = path.join(process.cwd(), 'public', 'uploads', 'test-sharp.webp');
      await sharp(buffer).webp().toFile(outPath);
      console.log('Successfully wrote test-sharp.webp');
      if (fs.existsSync(outPath)) {
        console.log('File physically exists.');
        fs.unlinkSync(outPath);
      }
    } else {
      console.log('Placeholder file not found.');
    }
  } catch (e) {
    console.error('Sharp test failed:', e);
  }
}

testSharp();
