# Catalog Download API Route

## Overview

This API route handles lead capture for catalog PDF downloads. It validates lead information, stores it for CRM purposes, tracks analytics, and returns the download URL.

## Endpoint

**POST** `/api/catalog-download`

## Features

- ✅ Lead capture and validation
- ✅ Form validation with Zod schema
- ✅ Input sanitization for security
- ✅ Rate limiting (3 requests per minute per IP)
- ✅ reCAPTCHA v3 verification
- ✅ Lead storage in Vercel KV
- ✅ Download event tracking
- ✅ Error handling with Sentry
- ✅ Multi-language support (FR, EN, ES, DE, RU)

## Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Example Corp",
  "country": "United States",
  "locale": "en",
  "recaptchaToken": "token..."
}
```

## Response

### Success (200)

```json
{
  "success": true,
  "message": "Lead captured successfully",
  "downloadUrl": "/assets/catalogs/afrexia-product-catalog-en.pdf",
  "leadId": "LEAD-1234567890-abc123"
}
```

### Error (400/429/500)

```json
{
  "success": false,
  "error": "Error message",
  "details": []
}
```

## Validation Rules

### Name
- Required
- 2-100 characters
- Letters, spaces, hyphens, and apostrophes only

### Email
- Required
- Valid email format
- Max 100 characters
- Converted to lowercase

### Company
- Required
- 1-100 characters

### Country
- Required
- 1-100 characters

## Storage

### Lead Storage
Leads are stored in Vercel KV with:
- Key: `catalog_lead:{leadId}`
- TTL: 90 days
- Data: Lead info + metadata (submittedAt, source)

### Leads List
All lead IDs are also added to:
- Key: `catalog_leads:list`
- Type: List (LPUSH)
- Purpose: Easy retrieval for reporting

## Analytics Tracking

### Download Events
Each download is tracked with:
- Key: `analytics:catalog_download:{timestamp}`
- TTL: 30 days
- Data: event, timestamp, country, locale, company

### Download Counter
Global counter maintained at:
- Key: `analytics:catalog_downloads:count`
- Type: Counter (INCR)

## Rate Limiting

- Window: 60 seconds
- Max requests: 3 per IP
- Key: `rate_limit:catalog_download:{ip}`

## PDF Catalog Files

The API returns URLs to catalog PDFs that should be located at:

```
/public/assets/catalogs/
  ├── afrexia-product-catalog-en.pdf
  ├── afrexia-product-catalog-fr.pdf
  ├── afrexia-product-catalog-es.pdf
  ├── afrexia-product-catalog-de.pdf
  └── afrexia-product-catalog-ru.pdf
```

## Environment Variables Required

```env
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
NEXT_PUBLIC_SITE_DOMAIN=afrexia.com
KV_URL=your_kv_url
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
```

## Future Enhancements

1. **Email Delivery**: Send catalog PDF via email instead of direct download
2. **CRM Integration**: Sync leads to external CRM (HubSpot, Salesforce, etc.)
3. **Dynamic PDF Generation**: Generate personalized catalogs based on user preferences
4. **Analytics Dashboard**: Build admin dashboard to view lead metrics
5. **Lead Scoring**: Implement lead scoring based on company size, country, etc.

## Related Files

- Schema: `lib/forms/catalog-download-schema.ts`
- Types: `types/index.ts`

## Usage Example

```typescript
// Client-side usage
const response = await fetch('/api/catalog-download', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Example Corp',
    country: 'United States',
    locale: 'en',
    recaptchaToken: token,
  }),
});

const data = await response.json();

if (data.success) {
  // Trigger download
  window.location.href = data.downloadUrl;
}
```
