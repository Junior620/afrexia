# Monitoring and Analytics Setup Guide

This document provides comprehensive information about the monitoring and analytics systems configured for the Afrexia website.

## Overview

The Afrexia website uses a multi-layered approach to monitoring and analytics:

1. **Sentry** - Error tracking and performance monitoring
2. **Plausible Analytics** - Privacy-friendly page view tracking (no consent required)
3. **Google Analytics 4** - Detailed behavior analysis (requires user consent)
4. **Vercel Analytics** - Performance monitoring and Core Web Vitals

## 1. Sentry Error Tracking

### Configuration

Sentry is configured for client-side, server-side, and edge runtime error tracking.

**Environment Variables:**
```bash
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token  # Optional, for source maps
SENTRY_ORG=your_sentry_org                # Optional
SENTRY_PROJECT=your_sentry_project        # Optional
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
```

**Configuration Files:**
- `sentry.client.config.ts` - Client-side error tracking
- `sentry.server.config.ts` - Server-side error tracking
- `sentry.edge.config.ts` - Edge runtime error tracking
- `instrumentation.ts` - Sentry initialization

### Features

- **Automatic Error Capture**: All unhandled errors are automatically captured
- **Performance Monitoring**: Tracks transaction performance with 10% sampling in production
- **Session Replay**: Records user sessions when errors occur
- **Privacy Protection**: Automatically filters sensitive data (emails, phone numbers, cookies)
- **Smart Filtering**: Ignores browser extension errors and network issues

### Verification

1. **Check Sentry Dashboard**: Visit your Sentry project dashboard
2. **Test Error Capture**: Trigger a test error in the application
3. **Verify Events**: Confirm events appear in Sentry within 1-2 minutes

**Test Command:**
```bash
npm run verify:monitoring
```

### Usage in Code

```typescript
import * as Sentry from '@sentry/nextjs';

// Capture an error
try {
  // Your code
} catch (error) {
  Sentry.captureException(error);
}

// Add context
Sentry.setUser({ id: userId, email: userEmail });
Sentry.setTag('feature', 'rfq-form');
```

## 2. Plausible Analytics

### Configuration

Plausible is a privacy-friendly analytics service that doesn't require cookie consent.

**Environment Variables:**
```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=afrexia.com
```

**Integration:**
- Automatically loaded in `AnalyticsProvider.tsx`
- Script: `https://plausible.io/js/script.js`

### Features

- **Privacy-Friendly**: No cookies, no personal data collection
- **GDPR Compliant**: No consent banner required
- **Lightweight**: < 1KB script size
- **Real-Time**: Live visitor tracking
- **Custom Events**: Track conversions and user actions

### Verification

1. **Visit Dashboard**: https://plausible.io/[your-domain]
2. **Check Real-Time**: Verify live visitors appear
3. **Test Events**: Trigger custom events and verify they appear

### Custom Events

The following conversion events are tracked:

- `rfq_submission` - RFQ form submissions
- `contact_submission` - Contact form submissions
- `resource_download` - Resource downloads
- `product_view` - Product page views
- `cta_click` - CTA button clicks

## 3. Google Analytics 4

### Configuration

GA4 provides detailed behavior analysis but requires user consent.

**Environment Variables:**
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Integration:**
- Loaded conditionally in `AnalyticsProvider.tsx` based on user consent
- Only loads after user accepts analytics cookies

### Features

- **Detailed Analytics**: User behavior, demographics, interests
- **Conversion Tracking**: E-commerce and custom conversions
- **Audience Building**: Create remarketing audiences
- **Integration**: Links with Google Ads and Search Console

### Verification

1. **Visit GA4 Dashboard**: https://analytics.google.com/
2. **Check Real-Time Reports**: Verify live users appear
3. **Test Events**: Trigger events and verify in DebugView

### Consent Management

GA4 only loads when:
1. User accepts analytics cookies via consent banner
2. Consent is stored in `localStorage` as `analytics-consent: true`
3. Do Not Track is not enabled

## 4. Vercel Analytics

### Configuration

Vercel Analytics is automatically enabled when deployed to Vercel.

**No environment variables required** - automatically configured.

**Integration:**
- Imported from `@vercel/analytics/react`
- Added to `AnalyticsProvider.tsx`

### Features

- **Core Web Vitals**: LCP, FID, CLS, TTFB, FCP
- **Real User Monitoring**: Actual user performance data
- **Geographic Distribution**: Performance by region
- **Device Breakdown**: Performance by device type

### Verification

1. **Visit Vercel Dashboard**: https://vercel.com/[your-team]/[your-project]/analytics
2. **Check Web Vitals**: Verify metrics are being collected
3. **Review Performance**: Check performance scores by page

## Analytics Event Tracking

### Available Functions

```typescript
import {
  trackEvent,
  trackRFQSubmission,
  trackContactSubmission,
  trackResourceDownload,
  trackProductView,
  trackCTAClick,
  isTrackingEnabled,
} from '@/lib/analytics/events';

// Track RFQ submission
trackRFQSubmission({
  productId: 'cacao-beans',
  productName: 'Premium Cacao Beans',
  quantity: 1000,
  incoterm: 'FOB',
  country: 'France',
});

// Track contact submission
trackContactSubmission({
  subject: 'Partnership Inquiry',
  hasCompany: true,
});

// Track resource download
trackResourceDownload({
  resourceId: 'product-catalog-2024',
  resourceTitle: 'Product Catalog 2024',
  resourceCategory: 'catalogs',
  fileFormat: 'pdf',
});

// Track product view
trackProductView({
  productId: 'cacao-beans',
  productName: 'Premium Cacao Beans',
  productCategory: 'cocoa',
  locale: 'en',
});

// Track CTA click
trackCTAClick({
  ctaText: 'Request Quote',
  ctaLocation: 'product-page',
  ctaDestination: '/rfq',
});

// Check if tracking is enabled
if (isTrackingEnabled()) {
  // Tracking is enabled
}
```

### Event Flow

1. **User Action** → Triggers event function
2. **Event Function** → Sends to all analytics platforms:
   - Plausible (always, respects DNT)
   - GA4 (only with consent, respects DNT)
   - Vercel Analytics (always, respects DNT)

## Privacy Compliance

### Do Not Track (DNT)

All analytics systems respect the Do Not Track browser setting:

```typescript
// Automatically checked before sending events
function isDNTEnabled(): boolean {
  const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
  return dnt === '1' || dnt === 'yes';
}
```

### GDPR Compliance

- **Plausible**: No consent required (no cookies, no personal data)
- **GA4**: Requires explicit user consent via cookie banner
- **Vercel Analytics**: No consent required (aggregated data only)
- **Sentry**: No consent required (error tracking is legitimate interest)

### Data Filtering

Sentry automatically filters sensitive data:
- Email addresses → `[Filtered]`
- Phone numbers → `[Filtered]`
- API keys → `[Filtered]`
- Cookies → Removed
- Authorization headers → Removed

## Verification Checklist

### Development Environment

- [ ] All environment variables set in `.env.local`
- [ ] Sentry captures test errors
- [ ] Analytics events fire in browser console
- [ ] No console errors related to analytics

### Production Environment

- [ ] All environment variables set in Vercel dashboard
- [ ] Sentry dashboard shows production errors
- [ ] Plausible dashboard shows page views
- [ ] GA4 real-time reports show users (with consent)
- [ ] Vercel Analytics shows Core Web Vitals
- [ ] Cookie consent banner appears for GA4
- [ ] DNT setting is respected

## Troubleshooting

### Sentry Not Tracking Errors

1. Check `NEXT_PUBLIC_SENTRY_DSN` is set
2. Verify DSN is correct in Sentry dashboard
3. Check browser console for Sentry errors
4. Ensure `NODE_ENV=production` for production tracking

### Plausible Not Tracking Page Views

1. Check `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` matches your domain
2. Verify domain is added in Plausible dashboard
3. Check browser console for script loading errors
4. Ensure ad blockers are not blocking Plausible

### GA4 Not Tracking Events

1. Check `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
2. Verify user has given analytics consent
3. Check DNT is not enabled
4. Use GA4 DebugView to see real-time events
5. Verify measurement ID in GA4 dashboard

### Vercel Analytics Not Working

1. Verify deployment is on Vercel
2. Check Vercel dashboard for analytics tab
3. Wait 24 hours for initial data collection
4. Ensure `@vercel/analytics` package is installed

## Monitoring Best Practices

### Error Handling

```typescript
// Always wrap critical operations
try {
  await criticalOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: 'rfq-form' },
    extra: { userId, formData },
  });
  // Show user-friendly error message
}
```

### Performance Monitoring

```typescript
// Track custom performance metrics
const startTime = performance.now();
await expensiveOperation();
const duration = performance.now() - startTime;

Sentry.captureMessage('Expensive operation completed', {
  level: 'info',
  extra: { duration },
});
```

### Analytics Events

```typescript
// Track all conversion events
trackRFQSubmission({ /* data */ });
trackContactSubmission({ /* data */ });
trackResourceDownload({ /* data */ });
```

## Support and Resources

### Documentation

- **Sentry**: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Plausible**: https://plausible.io/docs
- **GA4**: https://support.google.com/analytics/
- **Vercel Analytics**: https://vercel.com/docs/analytics

### Dashboards

- **Sentry**: https://sentry.io/organizations/[your-org]/projects/
- **Plausible**: https://plausible.io/[your-domain]
- **GA4**: https://analytics.google.com/
- **Vercel**: https://vercel.com/[your-team]/[your-project]/analytics

## Maintenance

### Regular Tasks

- **Weekly**: Review Sentry errors and fix critical issues
- **Monthly**: Review analytics data and optimize conversion funnels
- **Quarterly**: Audit privacy compliance and data filtering
- **Annually**: Review and update analytics goals and KPIs

### Alerts

Configure alerts in Sentry for:
- Critical errors (500 errors, payment failures)
- Performance degradation (slow API responses)
- High error rates (> 1% error rate)

## Conclusion

The monitoring and analytics system provides comprehensive visibility into:
- Application errors and performance (Sentry)
- User behavior and conversions (Plausible, GA4)
- Core Web Vitals and performance (Vercel Analytics)

All systems are privacy-compliant and respect user preferences (DNT, consent).
