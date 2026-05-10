import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'fs/promises';
import path from 'path';

const sourceImg = "C:\\Users\\hp\\.cursor\\projects\\c-Users-hp-Desktop-Killer-ilyass\\assets\\c__Users_hp_AppData_Roaming_Cursor_User_workspaceStorage_f77f0ae3b2a7f71204e02305ab7ff92c_images_Screenshot_2026-05-10_161601-Photoroom-2b0e8c99-c0a6-444f-89de-f30d05b1f522.png";
const appDir = path.join(process.cwd(), 'src', 'app');

async function generate() {
  console.log("Starting generation...");
  
  try {
    // Check if source exists
    await fs.access(sourceImg);
  } catch(e) {
    console.error("Source image not found:", sourceImg);
    return;
  }

  // 1. icon.png (transparent background, 192x192)
  console.log("Generating icon.png...");
  const iconPngBuf = await sharp(sourceImg)
    .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .toBuffer();
  await fs.writeFile(path.join(appDir, 'icon.png'), iconPngBuf);

  // 1b. favicon-32x32.png and favicon-16x16.png (just in case)
  await sharp(sourceImg).resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).toFile(path.join(appDir, 'favicon-32x32.png'));
  await sharp(sourceImg).resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).toFile(path.join(appDir, 'favicon-16x16.png'));

  // 2. favicon.ico
  console.log("Generating favicon.ico...");
  // Use a temporary png file for pngToIco as it expects paths or buffers but sometimes handles paths better
  const tmpIcoSrc = path.join(process.cwd(), 'tmp-icon.png');
  await fs.writeFile(tmpIcoSrc, iconPngBuf);
  const icoBuf = await pngToIco(tmpIcoSrc);
  await fs.writeFile(path.join(appDir, 'favicon.ico'), icoBuf);
  await fs.unlink(tmpIcoSrc);

  // 3. apple-icon.png (180x180 with a LIGHT background)
  console.log("Generating apple-icon.png...");
  await sharp(sourceImg)
    .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } }) // White background
    .flatten({ background: { r: 255, g: 255, b: 255 } }) // Ensure no transparency
    .toFile(path.join(appDir, 'apple-icon.png'));

  console.log("All done!");
}

generate().catch(console.error);