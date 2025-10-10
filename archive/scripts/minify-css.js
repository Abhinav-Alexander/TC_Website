#!/usr/bin/env node
/**
 * CSS Minification Script for Therapy Council Website
 * 
 * This script minifies all CSS files to improve website performance.
 * It removes whitespace, comments, and optimizes the CSS.
 * 
 * Usage: node minify-css.js
 * Or: npm run minify-css (if added to package.json)
 */

const fs = require('fs');
const path = require('path');

// Simple CSS minifier (no external dependencies)
function minifyCSS(css) {
    return css
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove whitespace around special characters
        .replace(/\s*([{}:;,>+~])\s*/g, '$1')
        // Remove whitespace around parentheses
        .replace(/\s*\(\s*/g, '(')
        .replace(/\s*\)\s*/g, ')')
        // Remove multiple spaces
        .replace(/\s+/g, ' ')
        // Remove leading/trailing whitespace
        .trim()
        // Remove last semicolon in a rule
        .replace(/;}/g, '}')
        // Remove space after colon in URLs
        .replace(/: /g, ':')
        // Remove trailing spaces
        .replace(/ }/g, '}')
        .replace(/ {/g, '{');
}

// Get file size in KB
function getFileSizeKB(filePath) {
    const stats = fs.statSync(filePath);
    return (stats.size / 1024).toFixed(2);
}

// Process single CSS file
function processCSSFile(filePath) {
    const fileName = path.basename(filePath);
    const dir = path.dirname(filePath);
    const minFileName = fileName.replace('.css', '.min.css');
    const minFilePath = path.join(dir, minFileName);
    
    try {
        // Read original file
        const originalCSS = fs.readFileSync(filePath, 'utf8');
        const originalSize = getFileSizeKB(filePath);
        
        // Minify
        const minifiedCSS = minifyCSS(originalCSS);
        
        // Write minified file
        fs.writeFileSync(minFilePath, minifiedCSS, 'utf8');
        const minifiedSize = getFileSizeKB(minFilePath);
        
        // Calculate savings
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

// Main function
function main() {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('   CSS Minification - Therapy Council Website');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    
    const cssDir = path.join(__dirname, 'css');
    
    // Check if css directory exists
    if (!fs.existsSync(cssDir)) {
        console.error('❌ Error: css directory not found!');
        process.exit(1);
    }
    
    // Get all CSS files (excluding already minified ones)
    const cssFiles = fs.readdirSync(cssDir)
        .filter(file => file.endsWith('.css') && !file.endsWith('.min.css'))
        .map(file => path.join(cssDir, file));
    
    if (cssFiles.length === 0) {
        console.log('⚠️  No CSS files found to minify.');
        process.exit(0);
    }
    
    console.log(`📁 Found ${cssFiles.length} CSS files to minify\n`);
    
    // Process all files
    const results = cssFiles.map(processCSSFile).filter(Boolean);
    
    // Calculate totals
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
    console.log('📝 Next steps:');
    console.log('1. Review the generated .min.css files');
    console.log('2. Update HTML files to use minified versions (production only)');
    console.log('3. Keep original .css files for development');
    console.log('');
}

// Run the script
main();

