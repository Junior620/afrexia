# Team Page

## Overview
The Team page displays all published team members from Sanity CMS with dark green premium styling.

## Features

### Hero Section
- Background image with dark overlay
- Page title and subtitle
- Multilingual support (FR, EN, ES, DE, RU)

### Team Grid
- Responsive grid layout (1 column mobile, 2 tablet, 3 desktop)
- Team member cards with:
  - Portrait photo (4:5 aspect ratio)
  - Name and position
  - Contact icons (email, phone, LinkedIn)
  - Bio preview (first paragraph)
  - Hover effects with scale and border color change

### CTA Section
- "Join Our Team" call-to-action
- Background image with overlay
- Link to contact page

## Design System

### Colors (Dark Green Premium)
- Background: `#0A1410`
- Card background: `#0F1814`
- Text primary: `#E8F5E9`
- Text secondary: `#C5D9C0`
- Text tertiary: `#80996F`
- Accent gold: `#A89858`
- Accent green: `#4A9A62`

### Card Styling
- Border: `rgba(255,255,255,0.08)`
- Hover border: `rgba(74,154,98,0.4)`
- Hover transform: `-translate-y-1`
- Hover shadow: `rgba(74,154,98,0.2)`

### Typography
- Hero title: 4xl → 5xl → 6xl (responsive)
- Card name: xl font-semibold
- Position: sm font-medium (gold accent)
- Bio: sm text

## Data Source

### Sanity CMS
Connected to `teamMember` schema with fields:
- `name` (string)
- `slug` (slug)
- `position` (object with 5 languages)
- `photo` (image with alt text)
- `bio` (blockContent with 5 languages)
- `email` (string)
- `phone` (string)
- `linkedin` (url)
- `order` (number for sorting)
- `workflowStatus` (draft/in_review/published)

### Query
Uses `getAllTeamMembers()` from `lib/sanity/queries.ts`:
- Fetches only published members
- Sorted by `order` field (ascending)
- Revalidates every 1 hour

## Navigation

### Header Link
Added to main navigation in `components/layout/Header.tsx`:
- Position: After "About", before "Resources"
- Translation key: `navigation.team`
- Available in all 5 languages

### Translation Keys
```json
{
  "navigation": {
    "team": "Équipe" // FR
    "team": "Team" // EN
    "team": "Equipo" // ES
    "team": "Team" // DE
    "team": "Команда" // RU
  }
}
```

## Accessibility

- Semantic HTML (`<main>`, `<section>`, `<article>`)
- Alt text for all images
- ARIA labels for icon-only links
- Keyboard navigation support
- Focus states on interactive elements

## Performance

- Static generation (SSG) with 1-hour revalidation
- Optimized images via Sanity CDN
- Lazy loading for images
- Minimal JavaScript (only hover effects)

## Empty State

If no team members are published:
- Shows centered message
- Maintains page structure
- Graceful fallback

## Related Files

- Page: `app/[locale]/team/page.tsx`
- Schema: `sanity/schemas/teamMember.ts`
- Query: `lib/sanity/queries.ts` (getAllTeamMembers)
- Navigation: `components/layout/Header.tsx`
- Translations: `public/locales/{locale}.json`

## Future Enhancements

Potential improvements:
- Individual team member detail pages (using slug)
- Filter by department/role
- Search functionality
- Social media integration beyond LinkedIn
- Team member testimonials
- Video introductions
