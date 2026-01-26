# Deployment Documentation Index

Complete guide to deploying and configuring the Afrexia website.

## Quick Start

- **[Deployment Quick Reference](./DEPLOYMENT_QUICK_REFERENCE.md)** - Essential commands and checklists
- **[Webhook Quick Start](./WEBHOOK_QUICK_START.md)** - 5-minute webhook setup guide
- **[Monitoring Quick Start](./MONITORING_QUICK_START.md)** - Quick monitoring setup

## Comprehensive Guides

### Deployment

- **[Deployment Guide](./DEPLOYMENT.md)** - Complete Vercel deployment guide
- **[Vercel Setup Guide](./VERCEL_SETUP_GUIDE.md)** - Detailed Vercel configuration
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Pre-deployment verification

### Webhook Configuration

- **[Sanity Webhook Setup](./SANITY_WEBHOOK_SETUP.md)** - Complete webhook configuration guide
  - Step-by-step setup instructions
  - Security considerations
  - Troubleshooting guide
  - Testing procedures
- **[Webhook Quick Start](./WEBHOOK_QUICK_START.md)** - 5-minute setup guide

### Monitoring & Analytics

- **[Monitoring & Analytics](./MONITORING_ANALYTICS.md)** - Complete monitoring setup
- **[Sentry Alerting Setup](./sentry-alerting-setup.md)** - Error tracking configuration

## CMS Documentation

- **[CMS Documentation](./cms/README.md)** - Complete CMS guide
- **[Workflow Guide](./cms/workflow-guide.md)** - Content workflow process
- **[Managing Products](./cms/managing-products.md)** - Product management guide
- **[Managing Blog Posts](./cms/managing-blog-posts.md)** - Blog content guide
- **[Managing Resources](./cms/managing-resources.md)** - Resource management

## Testing & Verification

### Webhook Testing

```bash
# Test webhook locally
npm run test:webhook

# Or using bash script
./scripts/test-webhook.sh
```

### Monitoring Verification

```bash
# Verify monitoring setup
npm run verify:monitoring
```

### Performance Testing

```bash
# Run Lighthouse CI
npm run lighthouse

# Analyze bundle size
npm run analyze
```

## Common Tasks

### Initial Deployment

1. Follow [Deployment Guide](./DEPLOYMENT.md)
2. Configure environment variables
3. Set up [Sanity Webhook](./SANITY_WEBHOOK_SETUP.md)
4. Configure [Monitoring](./MONITORING_ANALYTICS.md)
5. Complete [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)

### Webhook Configuration

1. Generate webhook secret
2. Add to Vercel environment variables
3. Configure in Sanity dashboard
4. Test with `npm run test:webhook`
5. Verify revalidation works

### Monitoring Setup

1. Configure Sentry error tracking
2. Set up Plausible Analytics
3. Enable Vercel Analytics
4. Configure alerting
5. Verify with `npm run verify:monitoring`

## Environment Variables

Required environment variables for deployment:

### Sanity CMS
```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
SANITY_API_TOKEN
SANITY_WEBHOOK_SECRET
```

### Email Service
```
RESEND_API_KEY
RESEND_FROM_EMAIL
RESEND_TO_EMAIL
SALES_EMAIL
CONTACT_EMAIL
```

### Security
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY
RECAPTCHA_SECRET_KEY
```

### Third-Party Services
```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
NEXT_PUBLIC_PLAUSIBLE_DOMAIN
NEXT_PUBLIC_GA_MEASUREMENT_ID
```

### Monitoring
```
NEXT_PUBLIC_SENTRY_DSN
SENTRY_AUTH_TOKEN
SENTRY_ORG
SENTRY_PROJECT
NEXT_PUBLIC_SENTRY_ENVIRONMENT
```

### Rate Limiting
```
KV_URL
KV_REST_API_URL
KV_REST_API_TOKEN
KV_REST_API_READ_ONLY_TOKEN
```

### Application
```
NEXT_PUBLIC_SITE_URL
NODE_ENV
```

See [.env.example](../.env.example) for complete list.

## Troubleshooting

### Webhook Issues

- [Webhook Troubleshooting](./SANITY_WEBHOOK_SETUP.md#troubleshooting)
- Test with: `npm run test:webhook`
- Check Vercel logs: `vercel logs /api/revalidate`

### Deployment Issues

- [Deployment Troubleshooting](./DEPLOYMENT.md#troubleshooting)
- Check build logs in Vercel dashboard
- Verify environment variables

### Monitoring Issues

- [Monitoring Troubleshooting](./MONITORING_ANALYTICS.md#troubleshooting)
- Verify with: `npm run verify:monitoring`
- Check Sentry dashboard

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Sanity Documentation**: https://www.sanity.io/docs
- **Sentry Documentation**: https://docs.sentry.io

## Related Documentation

- [Main README](../README.md) - Project overview
- [CMS Documentation](./cms/README.md) - Content management
- [Testing Documentation](../tests/README.md) - Testing guide

---

**Last Updated**: January 2026  
**Requirements**: All deployment-related requirements
