# PartnerSection Component

This directory contains the SCPB Partner Section component and its sub-components.

## Structure

- `PartnerSection.tsx` - Main container component
- `PhotoStack.tsx` - Image display with overlay
- `EditorialContent.tsx` - Text content with typography hierarchy
- `StatCards.tsx` - Optional trust indicator cards
- `CTARow.tsx` - Call-to-action buttons
- `TrustMicrocopy.tsx` - Trust indicators below CTAs

## Usage

```tsx
import PartnerSection from '@/components/sections/PartnerSection';

<PartnerSection locale="fr" />
```

## Type Definitions

See `types/partner-section.ts` for all TypeScript interfaces.

## Content

Content is managed in `lib/content/partner-section.ts` with support for FR and EN locales.
