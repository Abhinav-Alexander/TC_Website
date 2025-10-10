/**
 * Cache Version Management
 * Generates cache-busting versions for assets
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Get file hash for cache busting
function getFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex').substring(0, 8);
}

// Generate version manifest
function generateVersionManifest() {
  const manifest = {
    version: new Date().toISOString(),
    assets: {}
  };
  
  // CSS files
  const cssFiles = fs.readdirSync('css')
    .filter(f => f.endsWith('.min.css'));
  
  cssFiles.forEach(file => {
    const filePath = path.join('css', file);
    const hash = getFileHash(filePath);
    manifest.assets[`/css/${file}`] = hash;
  });
  
  // JavaScript files
  const jsFiles = ['script.js', 'sw-register.js'];
  jsFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const hash = getFileHash(file);
      manifest.assets[`/${file}`] = hash;
    }
  });
  
  // Write manifest
  fs.writeFileSync(
    'cache-manifest.json',
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('✅ Cache manifest generated');
  console.log(`   Version: ${manifest.version}`);
  console.log(`   Assets: ${Object.keys(manifest.assets).length}`);
  
  return manifest;
}

// Update service worker with new version
function updateServiceWorkerVersion() {
  const swPath = 'service-worker.js';
  let swContent = fs.readFileSync(swPath, 'utf8');
  
  // Update version in service worker
  const timestamp = Date.now();
  swContent = swContent.replace(
    /const CACHE_VERSION = '[^']+'/,
    `const CACHE_VERSION = 'tc-v${timestamp}'`
  );
  
  fs.writeFileSync(swPath, swContent);
  console.log('✅ Service worker version updated');
}

// Run if called directly
if (require.main === module) {
  console.log('🔄 Generating cache versions...\n');
  generateVersionManifest();
  updateServiceWorkerVersion();
  console.log('\n✨ Cache versioning complete!');
}

module.exports = { generateVersionManifest, updateServiceWorkerVersion };

