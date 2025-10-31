# Design System - Krysh HVAC Website

This document outlines the design system, components, and guidelines for the Krysh HVAC website.

## 🎨 Brand Identity

### Logo and Brand
- **Company Name**: Krysh HVAC
- **Tagline**: "Reliable Heating & Cooling Solutions"
- **Logo**: Clean, modern logo with HVAC iconography
- **Brand Voice**: Professional, trustworthy, approachable

### Brand Values
- **Quality First**: No compromise on workmanship
- **Reliability**: Dependable service and timely delivery
- **Integrity**: Honest communication and transparent pricing
- **Expertise**: Certified professionals with ongoing training

## 🌈 Color System

### Primary Color Palette
```css
:root {
  /* Primary Brand Colors */
  --primary-color: #2563eb;       /* Main Blue - CTAs, headers */
  --primary-hover: #1d4ed8;       /* Darker blue for hover states */
  --secondary-color: #0891b2;     /* Teal - secondary buttons */
  --accent-color: #06b6d4;        /* Light blue - highlights */
  
  /* Semantic Colors */
  --success-color: #059669;       /* Green - success messages */
  --warning-color: #d97706;       /* Orange - warnings */
  --error-color: #dc2626;         /* Red - errors */
  
  /* Neutral Colors */
  --text-primary: #1e293b;        /* Main text */
  --text-secondary: #64748b;      /* Secondary text */
  --border-color: #e2e8f0;        /* Borders and dividers */
  --light-bg: #f8fafc;            /* Light backgrounds */
}
```

### Color Usage Guidelines

**Primary Blue (#2563eb)**
- Call-to-action buttons
- Navigation active states
- Main headings
- Brand elements

**Secondary Teal (#0891b2)**
- Secondary buttons
- Alternative CTAs
- Accent elements

**Text Colors**
- Primary text: #1e293b (dark slate)
- Secondary text: #64748b (slate)
- Light text on dark: #ffffff

**Background Colors**
- Main background: #ffffff
- Section alternating: #f8fafc
- Card backgrounds: #ffffff

## 📝 Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

### Hierarchy
```css
h1 { font-size: 2.5rem; font-weight: 700; }  /* 40px */
h2 { font-size: 2rem; font-weight: 700; }    /* 32px */
h3 { font-size: 1.5rem; font-weight: 700; }  /* 24px */
h4 { font-size: 1.25rem; font-weight: 600; } /* 20px */
body { font-size: 1rem; line-height: 1.6; }  /* 16px */
```

### Typography Scale
- **Hero Title**: 3rem (48px) on desktop, 2rem (32px) on mobile
- **Section Title**: 2rem (32px)
- **Card Title**: 1.5rem (24px)
- **Body Text**: 1rem (16px)
- **Small Text**: 0.875rem (14px)

### Typography Guidelines
- Use system fonts for optimal performance
- Maintain 1.6 line-height for body text
- Use font-weight 700 for headings, 600 for sub-headings
- Ensure text contrast ratio ≥ 4.5:1 for accessibility

## 🏗️ Layout System

### Grid System
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
```

### Breakpoints
```css
/* Mobile First Approach */
/* Default: 320px+ */
@media (min-width: 768px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1200px) { /* Large Desktop */ }
```

### Spacing Scale
```css
/* Consistent spacing using rem units */
.mb-1 { margin-bottom: 0.25rem; }  /* 4px */
.mb-2 { margin-bottom: 0.5rem; }   /* 8px */
.mb-3 { margin-bottom: 1rem; }     /* 16px */
.mb-4 { margin-bottom: 1.5rem; }   /* 24px */
.mb-5 { margin-bottom: 2rem; }     /* 32px */
```

## 🧩 Component Library

### Buttons

#### Primary Button
```css
.btn-primary {
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}
```

#### Secondary Button
```css
.btn-secondary {
  background-color: var(--secondary-color);
  color: white;
  /* Same padding and styles as primary */
}
```

#### Outline Button
```css
.btn-outline {
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}
```

### Cards

#### Service Card
```css
.service-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}
```

#### Testimonial Card
```css
.testimonial {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  border-left: 4px solid var(--primary-color);
}
```

### Forms

#### Form Controls
```css
.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

### Navigation

#### Desktop Navigation
```css
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-link {
  font-weight: 500;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--primary-color);
}
```

#### Mobile Navigation
```css
@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    top: 70px;
    left: -100%;
    width: 100%;
    flex-direction: column;
    background-color: white;
    transition: left 0.3s ease;
  }
  
  .nav-menu.active {
    left: 0;
  }
}
```

## 📐 Spacing and Layout

### Section Spacing
```css
.section {
  padding: 4rem 0;
}

@media (max-width: 768px) {
  .section {
    padding: 2rem 0;
  }
}
```

### Grid Layouts
```css
/* Services Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}
```

## 🎭 Visual Effects

### Shadows
```css
:root {
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
               0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
```

### Transitions
```css
/* Standard transition for interactive elements */
transition: all 0.3s ease;

/* Hover transforms for cards */
transform: translateY(-5px);

/* Button hover effects */
transform: translateY(-1px);
```

### Border Radius
```css
/* Card radius */
border-radius: 1rem;    /* 16px */

/* Button radius */
border-radius: 0.5rem;  /* 8px */

/* Small elements */
border-radius: 0.25rem; /* 4px */
```

## 📱 Responsive Design

### Mobile-First Approach
1. Design for mobile (320px+) first
2. Progressive enhancement for larger screens
3. Touch-friendly interface (minimum 44px touch targets)
4. Readable text without zooming

### Responsive Images
```css
img {
  max-width: 100%;
  height: auto;
}

/* Hero image adjustments */
@media (max-width: 768px) {
  .hero .container {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
```

### Responsive Typography
```css
/* Fluid typography */
.hero-title {
  font-size: clamp(2rem, 5vw, 3rem);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  h1 { font-size: 2rem; }
  h2 { font-size: 1.75rem; }
}
```

## ♿ Accessibility Guidelines

### Color Contrast
- Text contrast ratio: ≥ 4.5:1
- Large text contrast ratio: ≥ 3:1
- UI component contrast ratio: ≥ 3:1

### Focus Management
```css
:focus {
  outline: 3px solid var(--primary-color);
  outline-offset: 2px;
}

/* Skip link for keyboard users */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-color);
  color: white;
  padding: 8px;
  text-decoration: none;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 6px;
}
```

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Include alt text for all images
- Use semantic elements (nav, main, article, section)
- Proper form labels and ARIA attributes

### Screen Reader Support
```html
<!-- Proper labeling -->
<button aria-label="Toggle navigation menu">
<img alt="Professional HVAC technician installing air conditioning">

<!-- ARIA landmarks -->
<main role="main">
<nav role="navigation">
```

## 🚀 Performance Guidelines

### Image Optimization
- Use WebP format with fallbacks
- Implement lazy loading: `loading="lazy"`
- Optimize images for different screen sizes
- Maximum image file size: 150KB

### CSS Optimization
- Use CSS custom properties for theming
- Minimize render-blocking CSS
- Use efficient selectors
- Combine similar styles

### JavaScript Performance
- Minimize JavaScript bundle size
- Use modern ES6+ features
- Implement event delegation
- Avoid DOM manipulation in loops

## 🎨 Icon System

### Icon Style
- Use emoji for simple icons (❄️, 🏠, 💨, 🔧)
- SVG icons for brand elements
- Consistent sizing: 24px, 32px, 48px
- Proper alt text or ARIA labels

### Icon Usage
```css
.service-icon {
  font-size: 3rem;     /* 48px */
  margin-bottom: 1rem;
}

.feature-icon {
  font-size: 2.5rem;   /* 40px */
  margin-bottom: 1rem;
}
```

## 📊 Component States

### Interactive States
```css
/* Default state */
.btn { /* normal styles */ }

/* Hover state */
.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

/* Active state */
.btn:active {
  transform: translateY(0);
}

/* Focus state */
.btn:focus {
  outline: 3px solid var(--primary-color);
  outline-offset: 2px;
}

/* Disabled state */
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
```

### Loading States
```css
.loading {
  opacity: 0.6;
  pointer-events: none;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

## 🎯 Brand Application

### Logo Usage
- Minimum size: 120px wide
- Clear space: 50% of logo width on all sides
- Use on white or light backgrounds
- SVG format for scalability

### Photography Style
- Professional, clean compositions
- Natural lighting preferred
- Focus on HVAC equipment and technicians
- Consistent color grading

### Tone of Voice
- **Professional**: Expert knowledge and certified service
- **Approachable**: Friendly, helpful communication
- **Reliable**: Dependable and trustworthy messaging
- **Local**: Melbourne-focused, community-oriented

## 📋 Design Checklist

### Visual Design
- [ ] Consistent color usage throughout
- [ ] Proper typography hierarchy
- [ ] Adequate white space and spacing
- [ ] High-quality, optimized images
- [ ] Consistent component styling

### Accessibility
- [ ] Color contrast meets WCAG 2.1 AA standards
- [ ] Keyboard navigation works properly
- [ ] Focus indicators are visible
- [ ] Alt text provided for images
- [ ] Semantic HTML structure

### Responsive Design
- [ ] Mobile-first design approach
- [ ] Flexible grid system
- [ ] Responsive images and typography
- [ ] Touch-friendly interface elements
- [ ] Cross-browser compatibility

### Performance
- [ ] Optimized images and assets
- [ ] Minimal external dependencies
- [ ] Efficient CSS and JavaScript
- [ ] Fast loading times
- [ ] Core Web Vitals compliance

---

**Design System Maintained By**: Krysh HVAC Development Team  
**Last Updated**: January 2025  
**Version**: 1.0
