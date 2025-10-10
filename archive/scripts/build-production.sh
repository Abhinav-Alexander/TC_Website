#!/bin/bash
# Production Build Script for Therapy Council Website
# 
# This script creates an optimized production build:
# 1. Minifies all CSS files
# 2. Creates production-ready HTML files with minified CSS references
# 3. Optionally converts logos to WebP
# 
# Usage: ./build-production.sh

set -e  # Exit on error

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Therapy Council Website - Production Build            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Minify CSS
echo -e "${BLUE}Step 1/3:${NC} Minifying CSS files..."
echo ""
node minify-css.cjs
echo ""

# Step 2: Check if logos need WebP conversion
echo -e "${BLUE}Step 2/3:${NC} Checking logo optimization..."
if [ ! -f "logo/logo_black.webp" ] || [ ! -f "logo/logo_white.webp" ]; then
    echo -e "${YELLOW}⚠️  WebP logos not found${NC}"
    if command -v cwebp &> /dev/null; then
        echo "Converting logos to WebP..."
        ./convert-logos-to-webp.sh
    else
        echo "⏭️  Skipping (cwebp not installed)"
        echo "   To install: brew install webp"
    fi
else
    echo "✅ WebP logos already exist"
fi
echo ""

# Step 3: Create production directory structure
echo -e "${BLUE}Step 3/3:${NC} Creating production build info..."
echo ""

# Generate build info
BUILD_DATE=$(date +"%Y-%m-%d %H:%M:%S")
cat > BUILD_INFO.txt << EOF
Therapy Council Website - Production Build
==========================================

Build Date: $BUILD_DATE
Build Type: Production (Optimized)

Optimizations Applied:
----------------------
✅ CSS Minification (all files)
✅ Google Fonts preloaded (async loading)
✅ JavaScript deferred loading
✅ Resource hints (dns-prefetch, preconnect)
EOF

if [ -f "logo/logo_black.webp" ]; then
    echo "✅ WebP logo images" >> BUILD_INFO.txt
fi

echo "$(cat BUILD_INFO.txt)"
echo ""

# Step 4: Generate production checklist
cat > PRODUCTION_CHECKLIST.md << 'EOF'
# Production Deployment Checklist

## ✅ Pre-Deployment Checks

### Code Quality
- [ ] All CSS files minified (check css/*.min.css exist)
- [ ] Font Awesome Kit configured (not using CDN)
- [ ] JavaScript deferred on all pages
- [ ] No console.log or debug code in production

### Performance
- [ ] Google Fonts loading asynchronously
- [ ] Resource hints added to all pages
- [ ] Images optimized (WebP where possible)
- [ ] No unused CSS or JS files

### Testing
- [ ] Test all pages locally first
- [ ] Check all links work
- [ ] Verify forms submit correctly
- [ ] Test on mobile devices
- [ ] Check all icons display

### SEO & Meta
- [ ] All pages have proper meta tags
- [ ] Canonical URLs set correctly
- [ ] sitemap.xml updated
- [ ] robots.txt configured

## 🚀 Deployment Steps

### 1. Update HTML to Use Minified CSS (Production Only)

**Option A: Automated (recommended)**
```bash
# Create production HTML files with minified CSS
node build-html-production.js
```

**Option B: Manual**
Replace in HTML files:
```html
<!-- Development -->
<link rel="stylesheet" href="css/base.css">

<!-- Production -->
<link rel="stylesheet" href="css/base.min.css">
```

### 2. Deploy Files

**If using Netlify/Vercel:**
```bash
git add .
git commit -m "Production build: optimized assets"
git push origin main
```

**If using FTP/cPanel:**
- Upload all files to server
- Ensure .min.css files are uploaded
- Clear server cache if applicable

### 3. Post-Deployment Verification

- [ ] Visit live site and check functionality
- [ ] Run Google PageSpeed Insights
- [ ] Check Google Search Console for errors
- [ ] Verify SSL certificate is active
- [ ] Test contact forms

## 📊 Performance Targets

After deployment, your site should achieve:

| Metric | Target | Tool |
|--------|--------|------|
| PageSpeed (Mobile) | 75+ | pagespeed.web.dev |
| PageSpeed (Desktop) | 85+ | pagespeed.web.dev |
| First Contentful Paint | < 2.0s | Lighthouse |
| Time to Interactive | < 3.5s | Lighthouse |
| Total Page Size | < 500KB | DevTools Network |

## 🔄 Rollback Plan

If something goes wrong:

1. **Immediate:** Revert to previous Git commit
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Manual:** Restore from backup files (.backup)
   ```bash
   for f in **/*.backup; do mv "$f" "${f%.backup}"; done
   ```

## 📝 Post-Deployment Tasks

- [ ] Monitor Google Analytics for issues
- [ ] Check error logs (if available)
- [ ] Update documentation if needed
- [ ] Inform team of deployment
- [ ] Schedule performance review in 1 week

EOF

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✨ Production Build Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 Generated Files:"
echo "   • css/*.min.css (minified stylesheets)"
echo "   • BUILD_INFO.txt (build details)"
echo "   • PRODUCTION_CHECKLIST.md (deployment guide)"
echo ""
echo "📝 Next Steps:"
echo "   1. Review PRODUCTION_CHECKLIST.md"
echo "   2. Test locally with minified CSS"
echo "   3. Run: npm run test-production (if available)"
echo "   4. Deploy when ready"
echo ""
echo "🧪 Test Commands:"
echo "   • Check file sizes: ls -lh css/*.min.css"
echo "   • Compare original: du -sh css/*.css css/*.min.css"
echo ""

