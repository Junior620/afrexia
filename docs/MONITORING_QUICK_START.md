# Monitoring & Analytics Quick Start Guide

## Quick Verification

Run this command to verify all monitoring and analytics systems:

```bash
npm run verify:monitoring
```

## Environment Variables Checklist

### Required for Production

Copy these to your Vercel dashboard under Settings → Environment Variables:

```bash
# Sentry Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_AUTH_TOKEN=your_auth_token  # Optional, for source maps
SENTRY_ORG=your_org                # Optional
SENTRY_PROJECT=your_project        # Optional

# Plausible Analytics (Privacy-friendly, no consent needed)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=afrexia.com

# Google Analytics 4 (Requires user consent)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Vercel Analytics (Automatic, no config needed)
# No environment variables required
```

## System Status

| Service | Status | Requires Consent | Documentation |
|---------|--------|------------------|---------------|
| **Sentry** | ✅ Configured | No | [Sentry Docs](https://docs.sentry.io/) |
| **Plausible** | ✅ Configured | No | [Plausible Docs](https://plausible.io/docs) |
| **GA4** | ✅ Configured | Yes | [GA4 Docs](https://support.google.com/analytics/) |
| **Vercel Analytics** | ✅ Configured | No | [Vercel Docs](https://vercel.com/docs/analytics) |

## Quick Tests

### 1. Test Sentry Error Tracking

Trigger a test error in your browser console:

```javascript
throw new Error('Test error for Sentry');
```

Check your Sentry dashboard: https://sentry.io/

### 2. Test Plausible Analytics

Visit your site and check real-time visitors:

https://plausible.io/afrexia.com

### 3. Test GA4 (with consent)

1. Accept analytics cookies on the site
2. Navigate through pages
3. Check GA4 real-time reports: https://analytics.google.com/

### 4. Test Vercel Analytics

Deploy to Vercel and check the Analytics tab in your dashboard:

https://vercel.com/[your-team]/[your-project]/analytics

## Tracked Events

The following conversion events are automatically tracked:

- ✅ `rfq_submission` - RFQ form submissions
- ✅ `contact_submission` - Contact form submissions
- ✅ `resource_download` - Resource downloads
- ✅ `product_view` - Product page views
- ✅ `cta_click` - CTA button clicks

## Privacy Compliance

- ✅ Do Not Track (DNT) respected across all platforms
- ✅ GDPR compliant with consent management for GA4
- ✅ Plausible requires no consent (no cookies, no personal data)
- ✅ Sensitive data automatically filtered in Sentry

## Troubleshooting

### Sentry not tracking errors?

1. Check `NEXT_PUBLIC_SENTRY_DSN` is set correctly
2. Verify DSN in Sentry dashboard matches
3. Ensure `NODE_ENV=production` for production tracking

### Plausible not tracking page views?

1. Check `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` matches your domain
2. Verify domain is added in Plausible dashboard
3. Disable ad blockers for testing

### GA4 not tracking events?

1. Check `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
2. Verify user has accepted analytics cookies
3. Check DNT is not enabled
4. Use GA4 DebugView for real-time debugging

### Vercel Analytics not working?

1. Verify deployment is on Vercel
2. Wait 24 hours for initial data collection
3. Check `@vercel/analytics` package is installed

## Support

For detailed documentation, see:
- [Full Monitoring & Analytics Guide](./MONITORING_ANALYTICS.md)
- [Deployment Guide](./DEPLOYMENT.md)

## Maintenance Schedule

- **Daily**: Monitor Sentry for critical errors
- **Weekly**: Review analytics data and conversion rates
- **Monthly**: Audit privacy compliance
- **Quarterly**: Review and optimize tracking strategy
