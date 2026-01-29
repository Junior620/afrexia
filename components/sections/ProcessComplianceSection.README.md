# ProcessComplianceSection Component

## Overview

The `ProcessComplianceSection` component displays quality standards, traceability processes, and certifications information in a responsive 3-column grid layout. It's designed for the product catalog page to communicate the company's commitment to quality and compliance.

## Features

- **Responsive Layout**: 3-column grid on desktop, 1-column on mobile
- **Multilingual Support**: Full translations for FR, EN, ES, DE, RU
- **Dark Mode**: Automatic theme adaptation
- **Animated Entrance**: Uses ScrollReveal for smooth animations
- **Icon-Based Design**: Visual icons for each section
- **Accessible**: Semantic HTML and proper ARIA attributes

## Usage

```tsx
import { ProcessComplianceSection } from '@/components/sections/ProcessComplianceSection';

export default function ProductCatalogPage({ params }: { params: { locale: string } }) {
  return (
    <main>
      <ProcessComplianceSection locale={params.locale as Locale}