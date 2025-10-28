# Reusable Items Analysis - Therapy Council Website

## Overview
This analysis identifies all reusable items across the website that can be centralized into variables or components for easier maintenance.

## 🔍 **Reusable Items Found**

### **1. Contact Information** (Used in 24+ files)
- **Email**: `support@therapycouncil.org`
- **Phone**: `(+91) 9211-750-322` / `+919211750322`
- **WhatsApp**: `https://wa.me/919211750322`

### **2. Company Information** (Used in 23+ files)
- **Company Name**: `Therapy Council`
- **Tagline**: `For Every Mind, Everywhere`
- **Copyright**: `© 2025 Therapy Council. All rights reserved.`

### **3. Social Media Links** (Used in 23+ files)
- **Facebook**: `https://www.facebook.com/profile.php?id=61576355709503`
- **Instagram**: `https://www.instagram.com/therapy_council/`
- **Twitter/X**: `https://x.com/Therapy_Council`
- **YouTube**: `https://www.youtube.com/@TherapyCouncil`
- **LinkedIn**: `https://www.linkedin.com/in/therapy-council`

### **4. Professional Credentials** (Used in 23+ files)
- **Experienced Psychologists**
- **HIPAA Compliant**
- **Evidence-Based**
- **Rated 5 Star on Google**

### **5. Service Information** (Used in 10+ files)
- **First Session Price**: `₹650`
- **Regular Price**: `₹1,999`
- **Session Duration**: `45 minutes`
- **Confidentiality**: `100% Confidential`

### **6. Navigation Menu** (Used in 32+ files)
- Home
- About
- Services
- Pricing
- Resources
- Contact
- Corporate Partnerships

### **7. Footer Links** (Used in 22+ files)
- Privacy Policy
- Terms of Service
- Refund Policy
- Careers

### **8. Author Information** (Used in 11+ files)
- **Name**: `Pragya Alexander`
- **Credentials**: `MSc Clinical Psychology, PGD in CBT`
- **Title**: `Clinical Psychologist & Founder`

### **9. Therapist Information** (Used in multiple files)
- **Pragya Alexander**: MSc Clinical Psychology, PGD in CBT
- **Falguni Sharma**: MA Clinical Psychology
- **Dr. Bhupinder Chaudhary**: BAMS, MSc Clinical Psychology
- **Akansha Negi**: MSc Clinical Psychology

### **10. Google Analytics & Tracking** (Used in multiple files)
- **Google Tag Manager**: `GTM-N7C89C8M`
- **Google Analytics**: `G-NV8J5JRVG0`
- **Facebook Pixel**: `785305737807988`

### **11. SEO Meta Information** (Used in multiple files)
- **Google Adsense**: `ca-pub-9857824386109365`
- **Bing Validation**: `D21F6E42BD44C613B541F255340BCE17`

### **12. Common CTAs** (Used in multiple files)
- "Book Your First Session – ₹650"
- "Free 10‑min discovery call"
- "Get Support"

### **13. Trust Indicators** (Used in multiple files)
- "Rated 5 Star on Google"
- "100% Confidential"
- "Experienced Therapists"
- "HIPAA Compliant"

### **14. Next Steps Content** (Used in thank-you pages)
- Call back process
- Therapist matching
- Save phone number instructions
- Contact alternatives

## 📊 **Usage Statistics**

| Item Type | Files Using It | Priority |
|-----------|----------------|----------|
| Contact Info | 24+ files | 🔴 High |
| Company Info | 23+ files | 🔴 High |
| Social Media | 23+ files | 🔴 High |
| Professional Credentials | 23+ files | 🔴 High |
| Navigation Menu | 32+ files | 🔴 High |
| Footer Links | 22+ files | 🔴 High |
| Author Info | 11+ files | 🟡 Medium |
| Service Info | 10+ files | 🟡 Medium |
| Therapist Info | Multiple | 🟡 Medium |
| Tracking Codes | Multiple | 🟡 Medium |
| SEO Meta | Multiple | 🟡 Medium |
| CTAs | Multiple | 🟡 Medium |
| Trust Indicators | Multiple | 🟡 Medium |

## 🎯 **Recommendations for Centralization**

### **Priority 1: High Impact Items**
1. **Contact Information** - Update once, changes everywhere
2. **Company Information** - Brand consistency
3. **Social Media Links** - Easy social media updates
4. **Navigation Menu** - Consistent navigation
5. **Professional Credentials** - Trust signal consistency

### **Priority 2: Medium Impact Items**
1. **Author Information** - Easy author updates
2. **Service Information** - Pricing updates
3. **Therapist Information** - Team updates
4. **CTAs** - Marketing message consistency

### **Priority 3: Low Impact Items**
1. **Tracking Codes** - Technical updates
2. **SEO Meta** - Technical maintenance

## 💡 **Implementation Strategy**

### **Option 1: JavaScript Configuration File**
Create `js/site-config.js` with all reusable data:
```javascript
const SITE_CONFIG = {
  contact: {
    email: 'support@therapycouncil.org',
    phone: '(+91) 9211-750-322',
    whatsapp: 'https://wa.me/919211750322'
  },
  company: {
    name: 'Therapy Council',
    tagline: 'For Every Mind, Everywhere',
    copyright: '© 2025 Therapy Council. All rights reserved.'
  },
  // ... more config
};
```

### **Option 2: JSON Configuration**
Create `data/site-config.json` for easy editing:
```json
{
  "contact": {
    "email": "support@therapycouncil.org",
    "phone": "(+91) 9211-750-322"
  }
}
```

### **Option 3: Template Components**
Create reusable HTML components for:
- Header/Navigation
- Footer
- Contact sections
- Trust indicators
- CTAs

## 🚀 **Benefits of Centralization**

1. **Single Source of Truth** - Update once, changes everywhere
2. **Consistency** - No more mismatched information
3. **Easy Maintenance** - Quick updates across all pages
4. **Reduced Errors** - No manual updates in multiple places
5. **Brand Consistency** - Unified messaging across all pages
6. **Scalability** - Easy to add new pages with consistent content

## 📝 **Next Steps**

1. Create centralized configuration file
2. Update all pages to use centralized data
3. Create reusable components for common sections
4. Implement dynamic content loading
5. Test all pages for consistency

This analysis shows significant opportunities for improving maintainability and consistency across your website.
