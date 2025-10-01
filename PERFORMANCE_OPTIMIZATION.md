# Website Performance Optimization Plan

## Current Performance Issues Identified

### 🔴 Critical Issues (High Impact)

#### 1. Font Awesome Over-loading
**Problem**: Loading entire Font Awesome library (600KB+) for only ~55 icons
- Current: `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">`
- Impact: ~600KB blocking CSS download
- Icons used: 55 unique icons across the site

**Solution Options**:
- **Option A (Best)**: Use Font Awesome Kit with only needed icons (reduces to ~20KB)
- **Option B**: Replace with inline SVG icons (0 external requests)
- **Option C**: Use subset builder tool

**Savings**: ~580KB, 1 fewer HTTP request, faster First Contentful Paint

---

#### 2. Google Fonts Blocking Render
**Problem**: Using `@import` in CSS (blocking) + loading 2 font families
- Current: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap');`
- Impact: Blocks CSS parsing, delays render

**Solution**:
```html
<!-- Add to <head> before CSS -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap"></noscript>
```

**Remove from CSS**: Delete @import line from base.css

**Savings**: ~200ms faster First Contentful Paint

---

#### 3. Multiple CSS Files Not Optimized
**Problem**: Loading 3-4 CSS files per page (not minified or combined)
- base.css (471 lines)
- header-footer.css (334 lines)
- home.css (1774 lines)
- Others: pricing, services, etc.

**Solution**:
- Combine critical CSS inline in `<head>`
- Load non-critical CSS asynchronously
- Minify all CSS files

**Savings**: ~100ms faster render, reduced HTTP requests

---

### 🟡 Important Issues (Medium Impact)

#### 4. PNG Logo Files
**Problem**: Logos in PNG format (20KB black, 16KB white)
**Solution**: Convert to WebP format
```bash
# Convert logos to WebP
cwebp -q 90 logo/logo_black.png -o logo/logo_black.webp
cwebp -q 90 logo/logo_white.png -o logo/logo_white.webp
```

Then use with fallback:
```html
<picture>
  <source srcset="logo/logo_white.webp" type="image/webp">
  <img src="logo/logo_white.png" alt="Therapy Council Logo">
</picture>
```

**Savings**: ~50% file size reduction (~18KB saved)

---

#### 5. Missing Resource Hints
**Problem**: No preconnect for external domains
**Solution**: Add to `<head>`:
```html
<!-- Resource hints -->
<link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
<link rel="dns-prefetch" href="https://www.googletagmanager.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**Savings**: ~100-200ms saved on external resource connections

---

#### 6. JavaScript Not Deferred Properly
**Problem**: `script.js` loads at end but blocks page completion
**Solution**: Add `defer` attribute
```html
<script src="script.js" defer></script>
```

**Savings**: Faster page interactive time

---

#### 7. No Image Lazy Loading
**Problem**: All images load immediately (therapist carousel, etc.)
**Solution**: Add `loading="lazy"` to off-screen images
```html
<img src="Therapists/Pragya.webp" alt="..." loading="lazy" decoding="async">
```

**Already done for therapist images** ✓ (Good!)

---

### 🟢 Minor Issues (Low Impact)

#### 8. Favicon Files Not Optimized
**Problem**: Multiple PNG favicons (96KB total)
**Note**: Acceptable for favicons, low priority

---

#### 9. No Compression Headers Visible
**Problem**: No visible gzip/brotli compression
**Solution**: Add to server config (if using Netlify/Vercel, automatic)

---

## Implementation Priority

### Phase 1: Quick Wins (1-2 hours)
1. ✅ Add resource hints (preconnect, dns-prefetch)
2. ✅ Fix Google Fonts loading (remove @import, add preload)
3. ✅ Add defer to script.js
4. ✅ Convert logos to WebP with fallback

### Phase 2: Icon Optimization (2-3 hours)
5. ✅ Replace Font Awesome with custom icon subset or inline SVGs

### Phase 3: CSS Optimization (3-4 hours)
6. ✅ Combine and minify CSS files
7. ✅ Extract critical CSS inline

### Phase 4: Advanced (Optional)
8. Set up build pipeline with minification
9. Implement service worker for caching
10. Add image CDN

---

## Expected Performance Improvements

| Metric | Current (Est.) | After Phase 1 | After Phase 2 | After Phase 3 |
|--------|----------------|---------------|---------------|---------------|
| First Contentful Paint | ~2.5s | ~1.8s | ~1.5s | ~1.2s |
| Largest Contentful Paint | ~3.5s | ~2.5s | ~2.0s | ~1.8s |
| Time to Interactive | ~4.0s | ~3.0s | ~2.5s | ~2.0s |
| Total Page Size | ~850KB | ~700KB | ~250KB | ~200KB |
| HTTP Requests | ~15 | ~13 | ~10 | ~8 |

---

## Specific Files to Modify

### Quick Win Implementation Files:
1. `index.html` - Add resource hints, fix fonts, defer scripts
2. `css/base.css` - Remove @import
3. All src/*.html files - Same optimizations
4. `logo/` - Add WebP versions

---

## Tools for Measurement

**Before & After Testing**:
- Google PageSpeed Insights: https://pagespeed.web.dev/
- WebPageTest: https://www.webpagetest.org/
- Chrome DevTools Lighthouse

**Current estimated score**: 60-70/100
**After optimizations**: 85-95/100


