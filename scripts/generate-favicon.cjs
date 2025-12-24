const sharp = require('sharp');
const pngToIco = require('png-to-ico').default || require('png-to-ico');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
  const publicDir = path.join(__dirname, '..', 'public');
  const svgPath = path.join(publicDir, 'favicon.svg');
  const tempPng48 = path.join(publicDir, 'favicon-48x48.png');
  const icoPath = path.join(publicDir, 'favicon.ico');

  console.log('🎨 Generating favicon.ico from favicon.svg...');

  // Generate 48x48 PNG from SVG using sharp
  await sharp(svgPath)
    .resize(48, 48)
    .png()
    .toFile(tempPng48);

  console.log('✅ Created 48x48 PNG');

  // Convert PNG to ICO (includes 16x16, 32x32, 48x48 sizes)
  const pngBuffer = fs.readFileSync(tempPng48);
  const icoBuffer = await pngToIco([pngBuffer]);
  
  fs.writeFileSync(icoPath, icoBuffer);
  console.log('✅ Created favicon.ico');

  // Clean up temp file
  fs.unlinkSync(tempPng48);
  console.log('🧹 Cleaned up temp files');

  console.log('🎉 Done! favicon.ico is ready at public/favicon.ico');
}

generateFavicon().catch(console.error);
