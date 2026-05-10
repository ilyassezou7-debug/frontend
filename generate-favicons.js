const sharp = require('sharp');
const pngToIco = require('png-to-ico').default || require('png-to-ico');
const fs = require('fs');
const path = require('path');

const srcPath = 'C:\\Users\\hp\\.cursor\\projects\\c-Users-hp-Desktop-Killer-ilyass\\assets\\c__Users_hp_AppData_Roaming_Cursor_User_workspaceStorage_f77f0ae3b2a7f71204e02305ab7ff92c_images_Screenshot_2026-05-10_161601-Photoroom-50fc7cff-1e2e-4944-9267-a66b847c489f.png';

const appDir = path.join(__dirname, 'src', 'app');
const publicDir = path.join(__dirname, 'public');

async function generate() {
  try {
    console.log("Generating icon.png...");
    await sharp(srcPath)
      .resize(192, 192, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toFile(path.join(appDir, 'icon.png'));

    console.log("Generating apple-icon.png...");
    await sharp(srcPath)
      .resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toFile(path.join(appDir, 'apple-icon.png'));

    console.log("Generating favicon.ico...");
    const tempFaviconPng = path.join(__dirname, 'temp-favicon.png');
    await sharp(srcPath)
      .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toFile(tempFaviconPng);
    
    const buf = await pngToIco(tempFaviconPng);
    fs.writeFileSync(path.join(appDir, 'favicon.ico'), buf);
    fs.unlinkSync(tempFaviconPng);

    console.log("Generating logo.png...");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    await sharp(srcPath)
      .resize({ height: 120 })
      .toFile(path.join(publicDir, 'logo.png'));

    // Also a light version using brightness or negate for dark mode if needed
    await sharp(srcPath)
      .negate({ alpha: false }) // Inverts colors but keeps alpha
      .resize({ height: 120 })
      .toFile(path.join(publicDir, 'logo-light.png'));

    console.log("Done.");
  } catch (err) {
    console.error(err);
  }
}

generate();
