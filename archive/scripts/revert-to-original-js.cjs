#!/usr/bin/env node

/**
 * Revert to Original JavaScript
 * Removes optimized JavaScript and restores original script.js
 */

const fs = require('fs');
const path = require('path');

// HTML files to update
const HTML_FILES = [
    'index.html',
    'src/about.html',
    'src/services.html',
    'src/pricing.html',
    'src/resources.html',
    'src/contact.html',
    'src/blog.html',
    'src/careers.html',
    'src/thank-you.html',
    'src/thank-you-contact.html',
    'src/thank-you-free.html',
    'src/posts/low-mood-to-depression.html',
    'src/posts/digital-detox-vs-digital-balance.html',
    'src/posts/therapy-costs-india.html',
    'privacy/index.html',
    'terms/index.html',
    'refund/index.html'
];

function revertToOriginalJS() {
    console.log('🔄 REVERTING TO ORIGINAL JAVASCRIPT');
    console.log('===================================');
    console.log('');
    
    let filesUpdated = 0;
    
    HTML_FILES.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            try {
                let content = fs.readFileSync(filePath, 'utf8');
                let originalContent = content;
                
                // Remove optimized JavaScript references
                const optimizedScripts = [
                    'js/script-core.min.js',
                    'js/script-home.min.js',
                    'js/script-blog.min.js',
                    'js/script-services.min.js',
                    'js/script-core.js',
                    'js/script-home.js',
                    'js/script-blog.js',
                    'js/script-services.js'
                ];
                
                // Remove optimized script tags
                optimizedScripts.forEach(script => {
                    const scriptRegex = new RegExp(`<script[^>]*src="${script.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*></script>`, 'g');
                    content = content.replace(scriptRegex, '');
                });
                
                // Remove optimized script comments
                content = content.replace(/<!-- ▸ OPTIMIZED SCRIPTS[^>]*-->/g, '');
                content = content.replace(/<!-- Core JavaScript[^>]*-->/g, '');
                content = content.replace(/<!-- Homepage specific JavaScript[^>]*-->/g, '');
                content = content.replace(/<!-- Blog specific JavaScript[^>]*-->/g, '');
                content = content.replace(/<!-- Service specific JavaScript[^>]*-->/g, '');
                
                // Add original script.js if not present
                if (!content.includes('script.js') && !content.includes('script.js"')) {
                    // Find the closing body tag and add script before it
                    const bodyCloseIndex = content.lastIndexOf('</body>');
                    if (bodyCloseIndex !== -1) {
                        content = content.slice(0, bodyCloseIndex) + 
                            '\n    <!-- ▸ SCRIPTS ----------------------------------------------------------- -->\n' +
                            '    <script src="script.js" defer></script>\n' +
                            content.slice(bodyCloseIndex);
                    }
                }
                
                if (content !== originalContent) {
                    fs.writeFileSync(filePath, content, 'utf8');
                    filesUpdated++;
                    console.log(`✅ Reverted: ${filePath}`);
                } else {
                    console.log(`⏭️  Skipped: ${filePath} (no optimized scripts found)`);
                }
                
            } catch (error) {
                console.error(`❌ Error updating ${filePath}:`, error.message);
            }
        } else {
            console.log(`⚠️  File not found: ${filePath}`);
        }
    });
    
    console.log('');
    console.log('📊 REVERSION SUMMARY');
    console.log('===================');
    console.log(`Files updated: ${filesUpdated}`);
    console.log('');
    console.log('🎯 CHANGES MADE:');
    console.log('✅ Removed optimized JavaScript references');
    console.log('✅ Restored original script.js approach');
    console.log('✅ All pages now use original JavaScript');
    console.log('');
    console.log('🧪 NEXT STEPS:');
    console.log('1. Test all pages for functionality');
    console.log('2. Verify carousels work correctly');
    console.log('3. Check mobile menu functionality');
    console.log('4. Test form validation');
    console.log('');
    console.log('🎉 REVERTED TO ORIGINAL JAVASCRIPT!');
    console.log('🚀 All functionality should work as before optimization!');
}

// Run the reversion
revertToOriginalJS();
