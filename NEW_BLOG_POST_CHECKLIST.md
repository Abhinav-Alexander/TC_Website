# New Blog Post Checklist

Use this checklist whenever you add a new blog post to the website.

## ✅ Creating the Blog Post

### 1. Create the Main Article File
- [ ] Create `/src/posts/[blog-slug].html`
- [ ] Use existing blog post as template
- [ ] Include proper SEO meta tags (title, description, keywords)
- [ ] Add Open Graph and Twitter Card tags
- [ ] Include JSON-LD structured data
- [ ] Add author information section
- [ ] Include table of contents
- [ ] Add social share buttons
- [ ] Ensure footer has Google rating and all 5 social icons
- [ ] Use absolute paths for favicons: `/favicon_io/...`

### 2. Create the Wrapper File
- [ ] Create directory: `/resources/posts/[blog-slug]/`
- [ ] Create `/resources/posts/[blog-slug]/index.html`
- [ ] Copy from existing wrapper (loads content via fetch)
- [ ] Update page title
- [ ] Update canonical URL
- [ ] Include favicon links (absolute paths)

### 3. Update Sitemap
- [ ] Add new blog post entry to `sitemap.xml`
- [ ] Use format: `https://therapycouncil.org/resources/posts/[blog-slug]`
- [ ] Set `<lastmod>` to today's date (YYYY-MM-DD)
- [ ] Set `<changefreq>` to `yearly` for blog posts
- [ ] Set `<priority>` to `0.7` for blog posts
- [ ] **Update `/resources` page lastmod** (since new content was added)
- [ ] **Update sitemap header "Last Updated" comment**
- [ ] **DO NOT update dates on other pages** unless they actually changed

## 📅 Date Update Guidelines

### ✅ ONLY Update `<lastmod>` Dates When:
- **New blog post added** → Update `/resources` date (new content on that page)
- **Blog post content significantly updated** → Update that specific blog post's date
- **Page content meaningfully changed** → Update only that page's date
- **Major rewrites or new sections added** → Update affected page's date

### ❌ DO NOT Update Dates For:
- Minor typo fixes
- CSS/styling changes
- Footer updates (unless it's a major change)
- Adding blog post to sitemap (don't update all pages)
- "Maintenance" or "keeping it fresh"

### Example:
```xml
<!-- Added new blog post about anxiety -->
<url>
    <loc>https://therapycouncil.org/resources</loc>
    <lastmod>2025-01-08</lastmod>  <!-- ✅ Updated: new content added -->
</url>

<url>
    <loc>https://therapycouncil.org/resources/posts/anxiety-understanding-managing</loc>
    <lastmod>2025-01-08</lastmod>  <!-- ✅ New post date -->
</url>

<url>
    <loc>https://therapycouncil.org/about</loc>
    <lastmod>2024-12-15</lastmod>  <!-- ✅ NOT updated: page didn't change -->
</url>
```

## 🔍 Testing Locally

- [ ] Start local server: `python3 -m http.server 8000`
- [ ] Test wrapper URL: `http://localhost:8000/resources/posts/[blog-slug]/`
- [ ] Verify favicon loads correctly
- [ ] Check table of contents works
- [ ] Test social share buttons
- [ ] Verify footer displays properly
- [ ] Test on mobile view

## 🚀 After Publishing

### Search Engine Submission
- [ ] Submit sitemap to Google Search Console
  - URL: `https://search.google.com/search-console`
  - Submit: `https://therapycouncil.org/sitemap.xml`
- [ ] Submit to Bing Webmaster Tools
  - URL: `https://www.bing.com/webmasters`
  - Submit sitemap URL

### Promotion (Optional)
- [ ] Share on social media (Facebook, Instagram, LinkedIn, Twitter/X)
- [ ] Send to email list if applicable
- [ ] Add to resources navigation if needed

## 📝 Current Blog Posts

1. Digital Detox vs. Digital Balance
   - URL: `/resources/posts/digital-detox-vs-digital-balance`
   
2. When Low Mood Becomes Depression
   - URL: `/resources/posts/low-mood-to-depression`
   
3. Therapy Costs in India
   - URL: `/resources/posts/therapy-costs-india`
   
4. Understanding and Managing Anxiety
   - URL: `/resources/posts/anxiety-understanding-managing`

## 🎯 Quick Reference: Blog Post Priority

In sitemap, all blog posts should have:
- `<changefreq>yearly</changefreq>`
- `<priority>0.7</priority>`

Main pages priority:
- Homepage: `1.0`
- Services: `0.9`
- Pricing: `0.9`
- Resources: `0.85`
- About: `0.8`
- Contact: `0.8`
- Careers: `0.7`
- Legal pages: `0.5-0.6`

---

## 💡 Remember:

**Only update dates when content actually changes!**

Search engines track changes and will notice if you update dates on unchanged content. This can hurt your SEO credibility. Be honest and accurate with your lastmod dates.

