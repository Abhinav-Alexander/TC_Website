#!/usr/bin/env node
/**
 * CSS Minification Script for Therapy Council Website (CommonJS)
 */

const fs = require('fs');
const path = require('path');

function minifyCSS(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s*([{}:;,>+~])\s*/g, '$1')
        .replace(/\s*\(\s*/g, '(')
        .replace(/\s*\)\s*/g, ')')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/;}/g, '}')
        .replace(/: /g, ':')
        .replace(/ }/g, '}')
        .replace(/ {/g, '{');
}

function getFileSizeKB(filePath) {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2);
}

function processCSSFile(filePath) {
    const fileName = path.basename(filePath);
    const dir = path.dirname(filePath);
    const minFileName = fileName.replace('.css', '.min.css');
    const minFilePath = path.join(dir, minFileName);
    
    try {
        const originalCSS = fs.readFileSync(filePath, 'utf8');
        const originalSize = getFileSizeKB(filePath);
        const minifiedCSS = minifyCSS(originalCSS);
        fs.writeFileSync(minFilePath, minifiedCSS, 'utf8');
        const minifiedSize = getFileSizeKB(minFilePath);
        const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
        console.log(`✅ ${fileName.padEnd(25)} ${originalSize} KB → ${minifiedSize} KB (${savings}% reduction)`);
        return {
            file: fileName,
            originalSize: parseFloat(originalSize),
            minifiedSize: parseFloat(minifiedSize),
            savings: parseFloat(savings)
        };
    } catch (error) {
        console.error(`❌ Error processing ${fileName}:`, error.message);
        return null;
    }
}

function main() {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('   CSS Minification - Therapy Council Website');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    
    const cssDir = path.join(__dirname, 'css');
    if (!fs.existsSync(cssDir)) {
        console.error('❌ Error: css directory not found!');
        process.exit(1);
    }
    const cssFiles = fs.readdirSync(cssDir)
        .filter(file => file.endsWith('.css') && !file.endsWith('.min.css'))
        .map(file => path.join(cssDir, file));
    if (cssFiles.length === 0) {
        console.log('⚠️  No CSS files found to minify.');
        process.exit(0);
    }
    console.log(`📁 Found ${cssFiles.length} CSS files to minify\n`);
    const results = cssFiles.map(processCSSFile).filter(Boolean);
    const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0);
    const totalMinified = results.reduce((sum, r) => sum + r.minifiedSize, 0);
    const totalSavings = ((totalOriginal - totalMinified) / totalOriginal * 100).toFixed(1);
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Summary');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total Original:  ${totalOriginal.toFixed(2)} KB`);
    console.log(`Total Minified:  ${totalMinified.toFixed(2)} KB`);
    console.log(`Total Savings:   ${(totalOriginal - totalMinified).toFixed(2)} KB (${totalSavings}%)`);
    console.log('');
    console.log('✨ Minification complete!');
    console.log('');
}

main();


