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

