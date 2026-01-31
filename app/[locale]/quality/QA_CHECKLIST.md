# Quality Page - QA Checklist

## Pre-Launch Checklist

### ✅ Content Verification

#### French (FR)
- [ ] Hero title and subtitle correct
- [ ] All 5 badges display correctly
- [ ] Trust microcopy present
- [ ] CTAs labeled correctly
- [ ] Certifications section title/subtitle
- [ ] 4 Quality Standards cards complete
- [ ] 6 QA Process steps with details
- [ ] 7 Compliance Pack documents listed
- [ ] 7 FAQ items with answers
- [ ] Final CTA section complete
- [ ] No typos or grammar errors

#### English (EN)
- [ ] All content translated
- [ ] Technical terms accurate
- [ ] CTAs make sense
- [ ] No French remnants

#### Spanish (ES)
- [ ] All content translated
- [ ] Technical terms accurate
- [ ] CTAs make sense

### ✅ Functional Testing

#### Navigation
- [ ] Hero CTA "Recevoir le pack" scrolls to #compliance-pack
- [ ] Hero CTA "Voir certifications" scrolls to #certifications
- [ ] "Demander liste complète" links to /contact
- [ ] Compliance pack CTA redirects to /contact?subject=compliance-pack
- [ ] Final CTA "Demander devis" links to /rfq
- [ ] Final CTA "Nous contacter" links to /contact

#### Interactive Elements
- [ ] FAQ accordéon opens/closes on click
- [ ] Only one FAQ open at a time
- [ ] Smooth expand/collapse animation
- [ ] Hover states work on all cards
- [ ] All buttons have hover effects

#### Data Loading
- [ ] Certifications load from Sanity CMS
- [ ] Fallback message shows if no certifications
- [ ] Images load correctly (logos, backgrounds)
- [ ] No console errors

### ✅ Responsive Design

#### Mobile (< 768px)
- [ ] Hero text readable
- [ ] Badges wrap correctly
- [ ] CTAs stack vertically
- [ ] Certifications grid: 1 column
- [ ] Standards grid: 1 column
- [ ] Timeline adapts (no left margin)
- [ ] Compliance docs grid: 1 column
- [ ] FAQ full width
- [ ] Final CTA buttons stack

#### Tablet (768px - 1024px)
- [ ] Certifications grid: 2 columns
- [ ] Standards grid: 2 columns
- [ ] Timeline shows with dots
- [ ] Compliance docs grid: 2 columns
- [ ] Proper spacing maintained

#### Desktop (> 1024px)
- [ ] Certifications grid: 3 columns
- [ ] Standards grid: 2 columns
- [ ] Timeline with numbered dots visible
- [ ] Compliance docs grid: 2 columns
- [ ] Max-width containers work
- [ ] Proper spacing and padding

### ✅ Accessibility

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus states visible on all buttons/links
- [ ] FAQ accordéon keyboard accessible
- [ ] Skip to main content works
- [ ] No keyboard traps

#### Screen Readers
- [ ] H1 unique and descriptive
- [ ] Heading hierarchy correct (H1 → H2 → H3)
- [ ] Alt text on all images
- [ ] ARIA labels on accordéon (aria-expanded)
- [ ] Links have descriptive text
- [ ] Buttons have clear labels

#### Color Contrast
- [ ] Text on dark background: AA minimum
- [ ] Badges readable
- [ ] Links distinguishable
- [ ] Focus states visible
- [ ] Icons have sufficient contrast

### ✅ Performance

#### Load Time
- [ ] Page loads < 3 seconds
- [ ] Images optimized (< 200KB each)
- [ ] No render-blocking resources
- [ ] Fonts load efficiently

#### Core Web Vitals
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] No layout shifts on load

#### Optimization
- [ ] Images use Next.js Image component
- [ ] Lazy loading on scroll animations
- [ ] No unnecessary re-renders
- [ ] Bundle size reasonable

### ✅ SEO

#### Meta Tags
- [ ] Title tag present and descriptive
- [ ] Meta description present (< 160 chars)
- [ ] Canonical URL set
- [ ] Alternate language links (hreflang)
- [ ] Open Graph tags (optional)

#### Content
- [ ] H1 unique per page
- [ ] Headings hierarchical
- [ ] Internal links present
- [ ] No broken links
- [ ] Content > 300 words

#### Technical
- [ ] robots.txt allows indexing
- [ ] sitemap.xml includes page
- [ ] Schema.org markup (optional: FAQPage)
- [ ] Mobile-friendly (Google test)

### ✅ Browser Compatibility

#### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Samsung Internet

### ✅ Content Accuracy

#### Compliance
- [ ] No false certifications claimed
- [ ] "Sur demande" used appropriately
- [ ] No unverified lab names (SGS, Bureau Veritas)
- [ ] "Laboratoires tiers accrédités" generic
- [ ] NDA mentions accurate

#### Legal
- [ ] No misleading claims
- [ ] Incoterms mentioned generically
- [ ] Lead times stated as estimates
- [ ] EUDR status: "preparing" not "certified"

### ✅ Localization

#### French (FR)
- [ ] All content in French
- [ ] Date formats: DD/MM/YYYY
- [ ] Currency: EUR (if applicable)
- [ ] Proper accents (é, è, à, etc.)

#### English (EN)
- [ ] All content in English
- [ ] Date formats: MM/DD/YYYY
- [ ] Currency: USD (if applicable)
- [ ] No French remnants

#### Spanish (ES)
- [ ] All content in Spanish
- [ ] Date formats: DD/MM/YYYY
- [ ] Proper accents (á, é, í, ó, ú, ñ)

### ✅ Analytics & Tracking

#### Events to Track
- [ ] Hero CTA clicks
- [ ] Certification CTA clicks
- [ ] Compliance pack CTA clicks
- [ ] FAQ opens/closes
- [ ] Final CTA clicks
- [ ] Page scroll depth

#### Setup
- [ ] Google Analytics installed
- [ ] Event tracking configured
- [ ] Conversion goals set
- [ ] UTM parameters work

### ✅ Security

#### Links
- [ ] External links have rel="noopener noreferrer"
- [ ] No mixed content (HTTP/HTTPS)
- [ ] No exposed API keys
- [ ] No sensitive data in URLs

#### Forms
- [ ] Contact form has CSRF protection
- [ ] Email validation works
- [ ] No SQL injection vulnerabilities
- [ ] Rate limiting on submissions

### ✅ Final Checks

#### Pre-Production
- [ ] All console errors fixed
- [ ] All console warnings addressed
- [ ] No TODO comments in code
- [ ] Code formatted and linted
- [ ] Git commit messages clear

#### Production
- [ ] Environment variables set
- [ ] CDN configured
- [ ] Caching headers correct
- [ ] Error monitoring active (Sentry)
- [ ] Backup plan in place

---

## Sign-Off

**QA Tester**: ___________________  
**Date**: ___________________  
**Status**: [ ] Approved [ ] Needs Fixes  

**Notes**:
_______________________________________
_______________________________________
_______________________________________

---

**Version**: 1.0.0  
**Last Updated**: 2026-01-31
