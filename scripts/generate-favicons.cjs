/**
 * Generate PNG favicons from SVG
 * Run with: node scripts/generate-favicons.js
 * Requires: npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6"/>
      <stop offset="100%" style="stop-color:#1E3A8A"/>
    </linearGradient>
  </defs>
  <path fill="url(#shieldGrad)" d="M256 21.33L64 106.67v128c0 118.4 81.92 229.12 192 256 110.08-26.88 192-137.6 192-256v-128L256 21.33z"/>
  <path fill="white" d="M213.33 341.33l-85.33-85.33 30.17-30.17 55.16 55.04 116.5-116.54L360 194.5 213.33 341.33z"/>
</svg>`;

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
];

async function generateFavicons() {
  const publicDir = path.join(__dirname, '..', 'public');
  
  for (const { name, size } of sizes) {
    try {
      await sharp(Buffer.from(svgContent))
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, name));
      console.log(`✓ Generated ${name}`);
    } catch (err) {
      console.error(`✗ Failed to generate ${name}:`, err.message);
    }
  }
}

generateFavicons().then(() => {
  console.log('\nDone! PNG favicons generated.');
});
