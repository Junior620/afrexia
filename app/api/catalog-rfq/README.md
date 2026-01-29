# Catalog RFQ API Route

## Overview

This API route handles multi-product RFQ (Request for Quote) submissions from the product catalog page.

## Endpoint

**POST** `/api/catalog-rfq`

## Features

- ✅ Multi-product RFQ support (up to 20 products)
- ✅ Form validation with Zod schema
- ✅ Input sanitization for security
- ✅ Rate limiting (3 requests per minute per IP)
- ✅ reCAPTCHA v3 verification
- ✅ Email notifications to sales team
- ✅ Confirmation emails to customers
- ✅ Request tracking in Vercel KV
- ✅ Error handling with Sentry
- ✅ Multi-language support (FR, EN, ES, DE, RU)

## Request Body

```json
{
  "products": [
    {
      "id": "product-slug",
      "quantity": 500,
      "unit": "kg"
    }
  ],
  "contact": {
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Example Corp",
    "phone": "+1234567890"
  },
  "delivery": {
    "location": "New York, USA",
    "incoterm": "FOB"
  },
  "notes": "Additional requirements...",
  "locale": "en",
  "recaptchaToken": "token..."
}
```

## Response

### Success (200)

```json
{
  "success": true,
  "message": "RFQ submitted successfully",
  "requestId": "RFQ-1234567890-abc123"
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

### Products
- Minimum: 1 product
- Maximum: 20 products
- Each product must have: id, quantity (positive number), unit

### Contact
- Name: 2-100 characters, letters only
- Email: Valid email format
- Company: Required, 1-100 characters
- Phone: 8-20 characters, valid phone format

### Delivery
- Location: Required, 1-200 characters
- Incoterm: Optional, must be valid (FOB, CIF, CFR, EXW, FCA, DAP, DDP)

### Notes
- Optional, max 2000 characters

## Email Templates

- **Sales Team**: `CatalogRFQEmail` - Detailed RFQ information
- **Customer**: `CatalogRFQConfirmationEmail` - Confirmation with summary

## Storage

RFQ submissions are stored in Vercel KV with:
- Key: `catalog_rfq:{requestId}`
- TTL: 30 days
- Data: Full submission + metadata

## Rate Limiting

- Window: 60 seconds
- Max requests: 3 per IP
- Key: `rate_limit:catalog_rfq:{ip}`

## Environment Variables Required

```env
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=noreply@afrexia.com
SALES_EMAIL=sales@afrexia.com
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
NEXT_PUBLIC_SITE_DOMAIN=afrexia.com
KV_URL=your_kv_url
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
```

## Related Files

- Schema: `lib/forms/catalog-rfq-schema.ts`
- Email Templates: `emails/CatalogRFQEmail.tsx`, `emails/CatalogRFQConfirmationEmail.tsx`
- Types: `types/rfq.ts`
