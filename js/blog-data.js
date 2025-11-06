/**
 * Centralized Blog Data Configuration
 * Update blog metadata here and it will automatically update across all pages
 */

const BLOG_DATA = {
  // Latest blog post - PCOS and Mental Health
  'pcos-and-mental-health': {
    slug: 'pcos-and-mental-health',
    title: 'The Link Between PCOS and Mental Health (And How Therapy Supports You)',
    shortTitle: 'The Link Between PCOS and Mental Health (And How Therapy Supports You)',
    date: '2025-11-06',
    displayDate: 'Nov 6, 2025',
    publishedDate: 'November 6, 2025',
    lastReviewed: 'November 6, 2025',
    readingTime: '8 min read',
    excerpt: 'Understanding the connection between PCOS and mental health, and how therapy can provide essential support for managing both physical and emotional challenges.',
    categories: ['Wellness & Self-Care', 'Therapy Guide'],
    tags: ['PCOS', 'Mental Health', 'Women\'s Health', 'Therapy'],
    image: 'resources/posts/pcos-and-mental-health/pcos.svg',
    imageAlt: 'The link between PCOS and mental health and how therapy supports you',
    author: 'Pragya Alexander, M.Sc Clinical Psychology, PGD in CBT',
    url: '/resources/posts/pcos-and-mental-health'
  },

  // Online Therapy First Choice in India
  'online-therapy-first-choice-india': {
    slug: 'online-therapy-first-choice-india',
    title: 'Why Online Therapy is Becoming the First Choice in India',
    shortTitle: 'Why Online Therapy is Becoming the First Choice in India',
    date: '2025-10-28',
    displayDate: 'Oct 28, 2025',
    publishedDate: 'October 28, 2025',
    lastReviewed: 'October 28, 2025',
    readingTime: '5 to 7 min read',
    excerpt: 'Discover why millions of Indians are choosing online therapy. Explore accessibility, affordability, effectiveness, and how digital mental healthcare is transforming lives.',
    categories: ['Therapy Guide', 'Digital Wellbeing'],
    tags: ['Online Therapy', 'Digital Health', 'India'],
    image: 'resources/posts/online-therapy-first-choice-india/online-therapy.svg',
    imageAlt: 'Why online therapy is becoming the first choice in India',
    author: 'Pragya Alexander, M.Sc Clinical Psychology, PGD in CBT',
    url: '/resources/posts/online-therapy-first-choice-india'
  },

  // Dating Burnout
  'dating-burnout-digital-age': {
    slug: 'dating-burnout-digital-age',
    title: 'Dating Burnout in the Digital Age: Recognition, Recovery & Mental Health Guide',
    shortTitle: 'Dating Burnout in the Digital Age: Recognition, Recovery & Mental Health Guide',
    date: '2025-10-22',
    displayDate: 'Oct 22, 2025',
    publishedDate: 'October 22, 2025',
    lastReviewed: 'October 22, 2025',
    readingTime: '12 min read',
    excerpt: 'Learn to identify dating burnout symptoms, understand digital dating fatigue, and discover evidence-based recovery strategies including therapy.',
    categories: ['Relationships & Dating', 'Digital Wellbeing'],
    tags: ['Dating', 'Relationships', 'Digital Wellness'],
    image: 'resources/posts/dating-burnout-digital-age/relation_burnout.svg',
    imageAlt: 'Dating burnout in the digital age: understanding and recovery strategies',
    author: 'Pragya Alexander, M.Sc Clinical Psychology, PGD in CBT',
    url: '/resources/posts/dating-burnout-digital-age'
  },

  // Workplace Burnout
  'workplace-burnout': {
    slug: 'workplace-burnout',
    title: 'Workplace Burnout: How to Recognize, Recover, and Reclaim Your Well-being',
    shortTitle: 'Workplace Burnout: How to Recognize, Recover, and Reclaim Your Well-being',
    date: '2025-10-15',
    displayDate: 'Oct 15, 2025',
    publishedDate: 'October 15, 2025',
    lastReviewed: 'October 15, 2025',
    readingTime: '8 min read',
    excerpt: 'Learn to identify burnout symptoms, understand why millennials face unique challenges, and discover evidence-based recovery strategies.',
    categories: ['Wellness & Self-Care', 'Therapy Guide'],
    tags: ['Burnout', 'Work Stress', 'Recovery'],
    image: 'resources/posts/workplace-burnout/burnout.svg',
    imageAlt: 'Workplace burnout: recognition and recovery strategies',
    author: 'Pragya Alexander, M.Sc Clinical Psychology, PGD in CBT',
    url: '/resources/posts/workplace-burnout'
  },

  // Mental Health Day
  'mental-health-day': {
    slug: 'mental-health-day',
    title: 'Mental Health Day 2025: How to Observe, Reflect & Take Action',
    shortTitle: 'Mental Health Day 2025: How to Observe, Reflect & Take Action',
    date: '2025-10-10',
    displayDate: 'Oct 10, 2025',
    publishedDate: 'October 10, 2025',
    lastReviewed: 'October 10, 2025',
    readingTime: '6 min read',
    excerpt: 'Discover why Mental Health Day matters, explore self-care strategies, and learn how to support loved ones.',
    categories: ['Wellness & Self-Care', 'Depression & Anxiety'],
    tags: ['Mental Health', 'Self-Care', 'Awareness'],
    image: 'resources/posts/mental-health-day/mental_health_day.svg',
    imageAlt: 'Mental Health Day 2025: awareness and self-care strategies',
    author: 'Pragya Alexander, M.Sc Clinical Psychology, PGD in CBT',
    url: '/resources/posts/mental-health-day'
  },

  // Anxiety Article
  'anxiety-understanding-managing': {
    slug: 'anxiety-understanding-managing',
    title: 'When Worry Becomes Anxiety: From Occasional Concern to Persistent Struggle',
    shortTitle: 'When Worry Becomes Anxiety: From Occasional Concern to Persistent Struggle',
    date: '2025-10-08',
    displayDate: 'Oct 8, 2025',
    publishedDate: 'October 8, 2025',
    lastReviewed: 'October 8, 2025',
    readingTime: '7 min read',
    excerpt: 'Understand when worry crosses the line into anxiety disorder. Learn to spot the signs and discover practical coping strategies.',
    categories: ['Depression & Anxiety', 'Therapy Guide'],
    tags: ['Anxiety', 'Worry', 'Coping'],
    image: 'resources/posts/anxiety-understanding-managing/4.svg',
    imageAlt: 'Understanding when worry becomes anxiety disorder',
    author: 'Pragya Alexander, M.Sc Clinical Psychology, PGD in CBT',
    url: '/resources/posts/anxiety-understanding-managing'
  },

  // Depression Article
  'low-mood-to-depression': {
    slug: 'low-mood-to-depression',
    title: 'When Low Mood Becomes Depression: How to Spot It?',
    shortTitle: 'When Low Mood Becomes Depression: How to Spot It?',
    date: '2025-10-01',
    displayDate: 'Oct 1, 2025',
    publishedDate: 'October 1, 2025',
    lastReviewed: 'October 1, 2025',
    readingTime: '9 min read',
    excerpt: 'Learn how to tell normal lows from clinical depression, evidence-backed treatments, and simple next steps to get help today.',
    categories: ['Depression & Anxiety', 'Therapy Guide'],
    tags: ['Depression', 'Low Mood', 'Treatment'],
    image: 'resources/posts/low-mood-to-depression/3.webp',
    imageAlt: 'Understanding when low mood becomes depression',
    author: 'Pragya Alexander, M.Sc Clinical Psychology, PGD in CBT',
    url: '/resources/posts/low-mood-to-depression'
  },

  // Therapy Costs
  'therapy-costs-india': {
    slug: 'therapy-costs-india',
    title: 'How Much Does Therapy Cost in India? Affordable Options Explained',
    shortTitle: 'How Much Does Therapy Cost in India? Affordable Options Explained',
    date: '2025-09-16',
    displayDate: 'Sep 16, 2025',
    publishedDate: 'September 16, 2025',
    lastReviewed: 'September 16, 2025',
    readingTime: '10 min read',
    excerpt: 'Complete guide to therapy costs in India. Explore affordable online therapy, insurance coverage, and budget-friendly options.',
    categories: ['Therapy Guide'],
    tags: ['Therapy Costs', 'Affordable', 'Insurance'],
    image: 'resources/posts/therapy-costs-india/2.svg',
    imageAlt: 'Therapy costs in India: affordable mental healthcare guide',
    author: 'Pragya Alexander, M.Sc Clinical Psychology, PGD in CBT',
    url: '/resources/posts/therapy-costs-india'
  },

  // Digital Detox
  'digital-detox-vs-digital-balance': {
    slug: 'digital-detox-vs-digital-balance',
    title: 'Digital Detox vs. Digital Balance: Which Is Better for Your Mental Wellbeing?',
    shortTitle: 'Digital Detox vs. Digital Balance: Which Is Better for Your Mental Wellbeing?',
    date: '2025-09-13',
    displayDate: 'Sep 13, 2025',
    publishedDate: 'September 13, 2025',
    lastReviewed: 'September 13, 2025',
    readingTime: '5 min read',
    excerpt: 'Understand the difference between a full reset and a sustainable approach, and how to choose what supports your mind best.',
    categories: ['Digital Wellbeing', 'Wellness & Self-Care'],
    tags: ['Digital Wellness', 'Balance', 'Technology'],
    image: 'resources/posts/digital-detox-vs-digital-balance/1.svg',
    imageAlt: 'Digital detox vs digital balance for mental wellbeing',
    author: 'Pragya Alexander, M.Sc Clinical Psychology, PGD in CBT',
    url: '/resources/posts/digital-detox-vs-digital-balance'
  }
};

/**
 * Utility functions for blog data
 */
const BlogUtils = {
  // Get all blog posts sorted by date (newest first)
  getAllPosts: function() {
    return Object.values(BLOG_DATA).sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Get latest blog post
  getLatestPost: function() {
    return this.getAllPosts()[0];
  },

  // Get blog post by slug
  getPostBySlug: function(slug) {
    return BLOG_DATA[slug] || null;
  },

  // Get posts by category
  getPostsByCategory: function(category) {
    return this.getAllPosts().filter(post => 
      post.categories.includes(category)
    );
  },

  // Format date for display
  formatDate: function(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  },

  // Generate meta tags for a blog post
  generateMetaTags: function(post) {
    return {
      title: `${post.title} | Therapy Council`,
      description: post.excerpt,
      publishedTime: post.date,
      modifiedTime: post.date,
      author: post.author,
      categories: post.categories.join(', ')
    };
  }
};

// Make data available globally
window.BLOG_DATA = BLOG_DATA;
window.BlogUtils = BlogUtils;
