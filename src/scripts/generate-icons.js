
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const input = 'src/assets/icon.png';
const outDir = 'public/icons';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function generate() {
  console.log('Generating icons...');
  try {
    await sharp(input).resize(192, 192).toFile(path.join(outDir, 'icon-192.png'));
    console.log('Created icon-192.png');
    
    await sharp(input).resize(512, 512).toFile(path.join(outDir, 'icon-512.png'));
    console.log('Created icon-512.png');
  } catch (err) {
    console.error('Error generating icons:', err);
    process.exit(1);
  }
}

generate();
