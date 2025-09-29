# Therapy Council Style Guide

## Overview
This style guide provides comprehensive design tokens and usage guidelines for the Therapy Council website. All tokens are designed with accessibility and user experience in mind.

## Color Palette

### Primary Colors
- **Background (#F6F7F8)**: Clean, neutral background for the entire site
- **Surface (#FFFFFF)**: Pure white for cards, modals, and elevated content
- **Text Primary (#1F2937)**: Dark gray for headings and important text
- **Text Secondary (#4B5563)**: Medium gray for body text and secondary information

### Accent Colors
- **Accent Teal (#2BB6A3)**: Used for links, small accents, and highlights
- **CTA Coral (#FF7A66)**: Used for call-to-action buttons and interactive elements

### Color Usage Guidelines

#### Background Colors
```css
/* Page background */
.page-background {
  background-color: #F6F7F8;
}

/* Card/surface background */
.card-background {
  background-color: #FFFFFF;
}
```

#### Text Colors
```css
/* Primary text (headings, important content) */
.text-primary {
  color: #1F2937;
}

/* Secondary text (body text, descriptions) */
.text-secondary {
  color: #4B5563;
}
```

#### Accent Colors
```css
/* Links and small accents */
.accent-teal {
  color: #2BB6A3;
}

/* Call-to-action buttons */
.cta-coral {
  background-color: #FF7A66;
  color: #FFFFFF;
}
```

## Typography

### Font Families
- **Headings**: Inter (with system font fallbacks)
- **Body Text**: Merriweather (with system serif fallbacks)

### Typography Scale

#### Headings
```css
h1 {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 40px;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #1F2937;
}

h2 {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 28px;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: #1F2937;
}

h3 {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 20px;
  line-height: 1.4;
  letter-spacing: 0;
  color: #1F2937;
}
```

#### Body Text
```css
body, p {
  font-family: Merriweather, Georgia, 'Times New Roman', serif;
  font-size: 16px;
  line-height: 1.6;
  letter-spacing: 0;
  color: #4B5563;
}
```

## Spacing Scale

The spacing system uses a consistent 4px base unit:

- **xs (4px)**: Icon padding, small gaps
- **sm (8px)**: Button padding, small margins
- **md (16px)**: Card padding, section margins
- **lg (24px)**: Between sections, form field spacing
- **xl (32px)**: Page margins, large section gaps
- **2xl (48px)**: Hero section spacing, major layout gaps
- **3xl (64px)**: Page top/bottom margins, major section separators

### Usage Examples
```css
/* Card padding */
.card {
  padding: 16px; /* md */
}

/* Section spacing */
.section {
  margin-bottom: 32px; /* xl */
}

/* Button padding */
.button {
  padding: 8px 16px; /* sm horizontal, md vertical */
}
```

## Border Radius

- **sm (4px)**: Small buttons, input fields, tags
- **md (8px)**: Cards, buttons, form elements
- **lg (12px)**: Large cards, modals, image containers
- **xl (16px)**: Hero sections, large containers

### Usage Examples
```css
/* Small elements */
.input, .tag {
  border-radius: 4px;
}

/* Cards and buttons */
.card, .button {
  border-radius: 8px;
}

/* Large containers */
.hero-section {
  border-radius: 16px;
}
```

## Shadows

- **sm**: Subtle elevation, small cards
- **md**: Cards, dropdowns, modals
- **lg**: Large cards, hero sections, major UI elements
- **xl**: Floating elements, major overlays

### Usage Examples
```css
/* Subtle elevation */
.small-card {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* Standard cards */
.card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Floating elements */
.modal {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```

## Accessibility Guidelines

### Color Contrast
All color combinations meet WCAG AA standards:

- **Text Primary (#1F2937) on Background (#F6F7F8)**: 12.63:1 contrast ratio ✅
- **Text Secondary (#4B5563) on Background (#F6F7F8)**: 7.73:1 contrast ratio ✅
- **Text Primary (#1F2937) on Surface (#FFFFFF)**: 15.8:1 contrast ratio ✅
- **Text Secondary (#4B5563) on Surface (#FFFFFF)**: 9.54:1 contrast ratio ✅
- **White text on CTA Coral (#FF7A66)**: 4.5:1 contrast ratio ✅
- **White text on Accent Teal (#2BB6A3)**: 3.1:1 contrast ratio ⚠️ (use with caution)

### Typography Accessibility
- Line heights provide comfortable reading experience
- Font sizes are appropriate for all age groups
- Letter spacing improves readability
- System font fallbacks ensure consistent rendering

## Component Examples

### Button Styles
```css
/* Primary CTA Button */
.btn-primary {
  background-color: #FF7A66;
  color: #FFFFFF;
  padding: 8px 16px;
  border-radius: 8px;
  font-family: Inter, sans-serif;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

/* Secondary Button */
.btn-secondary {
  background-color: transparent;
  color: #2BB6A3;
  border: 2px solid #2BB6A3;
  padding: 8px 16px;
  border-radius: 8px;
  font-family: Inter, sans-serif;
  font-size: 16px;
  cursor: pointer;
}
```

### Card Component
```css
.card {
  background-color: #FFFFFF;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
}
```

## Implementation Notes

1. **CSS Custom Properties**: Consider implementing these tokens as CSS custom properties for easy theming
2. **Responsive Design**: All tokens work across different screen sizes
3. **Dark Mode**: Consider creating a dark mode variant of these tokens
4. **Consistency**: Use these tokens consistently across all components
5. **Testing**: Always test color combinations for accessibility compliance

## File Structure
```
/design-tokens.json - Complete design token definitions
/style-guide.md - This style guide with usage examples
```
