# Blog Data Management System

## Overview
This system centralizes all blog post metadata in a single file (`js/blog-data.js`) so you can update dates, titles, and other information in one place and it automatically updates across all pages.

## How to Update Blog Dates

### 1. Open the Blog Data File
Navigate to: `/js/blog-data.js`

### 2. Find the Blog Post You Want to Update
Each blog post is stored as an object with the following structure:
```javascript
'dating-burnout-digital-age': {
  date: '2025-10-22',           // ISO date format
  displayDate: 'Oct 22, 2025',  // Human-readable format
  publishedDate: 'October 22, 2025', // Full date format
  // ... other metadata
}
```

### 3. Update the Date
Change the date values to your new date:
```javascript
// Example: Update dating burnout article to November 15, 2025
'dating-burnout-digital-age': {
  date: '2025-11-15',
  displayDate: 'Nov 15, 2025',
  publishedDate: 'November 15, 2025',
  lastReviewed: 'November 15, 2025',
  // ... rest stays the same
}
```

### 4. Save the File
That's it! The date will automatically update on:
- ✅ Home page resources section
- ✅ Blog listing page (resources.html)
- ✅ Individual blog post page
- ✅ All meta tags and structured data

## Available Blog Posts

1. **dating-burnout-digital-age** - Dating Burnout in the Digital Age
2. **workplace-burnout** - Workplace Burnout Recovery
3. **mental-health-day** - Mental Health Day 2025
4. **anxiety-understanding-managing** - When Worry Becomes Anxiety
5. **low-mood-to-depression** - When Low Mood Becomes Depression
6. **therapy-costs-india** - Therapy Costs in India
7. **digital-detox-vs-digital-balance** - Digital Detox vs Digital Balance

## Benefits

✅ **Single Source of Truth**: Update once, changes everywhere
✅ **No Manual Updates**: No need to hunt through multiple files
✅ **Consistent Data**: Eliminates date mismatches across pages
✅ **Easy Maintenance**: Simple JavaScript object to manage
✅ **Future-Proof**: Easy to add new blog posts

## Example: Update Latest Blog Date

To update the dating burnout article date to November 1, 2025:

1. Open `js/blog-data.js`
2. Find the `'dating-burnout-digital-age'` object
3. Update these fields:
   ```javascript
   date: '2025-11-01',
   displayDate: 'Nov 1, 2025',
   publishedDate: 'November 1, 2025',
   lastReviewed: 'November 1, 2025',
   ```
4. Save the file

The date will automatically update on all pages!

## Adding New Blog Posts

To add a new blog post:

1. Add a new object to the `BLOG_DATA` object in `js/blog-data.js`
2. Follow the same structure as existing posts
3. Use a unique slug as the key
4. The system will automatically handle it on all pages

## Technical Notes

- The system uses JavaScript to dynamically populate dates on page load
- All pages load the `blog-data.js` file first
- Dates are updated via DOM manipulation after the page loads
- Meta tags and structured data are also updated automatically
