# CatalogDownloadModal Component

## Overview

The `CatalogDownloadModal` component is a lead capture modal that collects user information before allowing them to download the product catalog PDF. This component is part of the product catalog redesign and implements Requirements 7.1-7.5.

## Features

- **Lead Capture Form**: Collects name, email, company, and country
- **Form Validation**: Validates all required fields with specific error messages
- **Email Validation**: Ensures valid email format
- **Searchable Country Dropdown**: 30+ countries with search functionality
- **Privacy Message**: Displays data protection message
- **Loading States**: Shows loading indicator during submission
- **Success/Error Feedback**: Visual feedback for submission status
- **Automatic Download**: Triggers PDF download on successful submission
- **Accessibility**: Full keyboard navigation, focus trap, ARIA attributes
- **Responsive Design**: Works on all screen sizes

## Props

```typescript
interface CatalogDownloadModalProps {
  locale: string;                                    // Current locale (fr, en, es, de, ru)
  translations: DownloadTranslations;                // Translation strings
  isOpen: boolean;                                   // Modal open state
  onClose: () => void;                               // Close handler
  onSubmit: (data: LeadData) => Promise<string>;    // Submit handler, returns download URL
}

interface LeadData {
  name: string;
  email: string;
  company: string;
  country: string;
}

interface DownloadTranslations {
  title: string;
  subtitle: string;
  close: string;
  fields: {
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    company: string;
    companyPlaceholder: string;
    country: string;
    countryPlaceholder: string;
  };
  privacyMessage: string;
  download: string;
  downloading: string;
  success: string;
  error: string;
}
```

## Usage

### Basic Usage

```tsx
import { CatalogDownloadModal, LeadData } from '@/components/catalog';
import { useState } from 'react';

function CatalogPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (data: LeadData): Promise<string> => {
    // Send lead data to your API
    const response = await fetch('/api/catalog-download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const { downloadUrl } = await response.json();
    return downloadUrl;
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        Download Catalog
      </button>

      <CatalogDownloadModal
        locale="en"
        translations={translations}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
```

### With Translation Loading

```tsx
import { CatalogDownloadModal } from '@/components/catalog';
import { useTranslations } from '@/lib/i18n';

function CatalogPage({ locale }: { locale: string }) {
  const t = useTranslations(locale, 'catalog');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const translations = {
    title: t('catalogDownload.title'),
    subtitle: t('catalogDownload.subtitle'),
    close: t('catalogDownload.close'),
    fields: {
      name: t('catalogDownload.fields.name'),
      namePlaceholder: t('catalogDownload.fields.namePlaceholder'),
      email: t('catalogDownload.fields.email'),
      emailPlaceholder: t('catalogDownload.fields.emailPlaceholder'),
      company: t('catalogDownload.fields.company'),
      companyPlaceholder: t('catalogDownload.fields.companyPlaceholder'),
      country: t('catalogDownload.fields.country'),
      countryPlaceholder: t('catalogDownload.fields.countryPlaceholder'),
    },
    privacyMessage: t('catalogDownload.privacyMessage'),
    download: t('catalogDownload.download'),
    downloading: t('catalogDownload.downloading'),
    success: t('catalogDownload.success'),
    error: t('catalogDownload.error'),
  };

  return (
    <CatalogDownloadModal
      locale={locale}
      translations={translations}
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleSubmit}
    />
  );
}
```

## Validation Rules

The component validates the following:

- **Name**: Required, minimum 2 characters
- **Email**: Required, valid email format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- **Company**: Required, minimum 2 characters
- **Country**: Required, must select from dropdown

## Behavior

1. **Opening**: Modal opens with fade and zoom animation
2. **Focus Management**: Focus is trapped within the modal
3. **Form Submission**:
   - Validates all fields
   - Shows field-specific error messages
   - Disables form during submission
   - Shows loading state on submit button
4. **Success**:
   - Displays success message
   - Triggers PDF download automatically
   - Closes modal after 2 seconds
5. **Error**:
   - Displays error message
   - Allows user to retry
6. **Closing**:
   - ESC key closes modal
   - Clicking overlay closes modal
   - Close button closes modal
   - Focus returns to trigger element
   - Form resets on close

## Accessibility

- **Keyboard Navigation**: All form fields are keyboard accessible
- **Focus Trap**: Focus stays within modal when open
- **Focus Return**: Focus returns to trigger element on close
- **ARIA Attributes**: 
  - `role="dialog"`
  - `aria-modal="true"`
  - `aria-labelledby` for title
  - `aria-describedby` for error messages
- **Screen Reader Support**: Error messages announced via `role="alert"`
- **Touch Targets**: All interactive elements meet 44x44px minimum

## Styling

The component uses Tailwind CSS classes and follows the design system:

- **Border Radius**: 16px (rounded-2xl)
- **Max Width**: 28rem (max-w-md)
- **Padding**: 2rem (p-8)
- **Colors**: Primary brand colors, gray scale
- **Shadows**: shadow-2xl for modal
- **Animations**: fade-in, zoom-in-95

## Integration with Analytics

Track catalog downloads in your submit handler:

```tsx
const handleSubmit = async (data: LeadData): Promise<string> => {
  // Track analytics event
  trackEvent('catalog_download', {
    name: data.name,
    company: data.company,
    country: data.country,
    timestamp: new Date().toISOString(),
  });

  // Submit to API
  const response = await fetch('/api/catalog-download', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  return response.json().then(res => res.downloadUrl);
};
```

## API Endpoint Example

Create an API route at `/api/catalog-download`:

```typescript
// app/api/catalog-download/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();

  // Validate data
  if (!data.name || !data.email || !data.company || !data.country) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Store lead in database/CRM
  await storeLead(data);

  // Track download event
  await trackDownload(data);

  // Return download URL
  return NextResponse.json({
    downloadUrl: '/path/to/catalog.pdf',
  });
}
```

## Requirements Mapping

This component implements the following requirements:

- **7.1**: Provides "Download Catalog PDF" CTA button functionality
- **7.2**: Presents form requesting contact information when download is clicked
- **7.3**: Validates contact information before allowing download
- **7.4**: Provides PDF catalog file for download when validation succeeds
- **7.5**: Tracks catalog download events for analytics

## Related Components

- `CatalogHeader`: Contains the download catalog button that triggers this modal
- `Input`: Used for text input fields
- `Select`: Used for country dropdown
- `Button`: Used for submit button

## Testing

See `CatalogDownloadModal.example.tsx` for a working example with test data.

## Notes

- The component includes 30 common countries for B2B export business
- Form data is reset when modal closes
- Download is triggered automatically via a temporary anchor element
- Body scroll is locked when modal is open
- The component is fully client-side (`'use client'`)
