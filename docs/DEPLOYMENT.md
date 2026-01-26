# Vercel Deployment Guide - Afrexia Website

This guide covers the complete deployment process for the Afrexia B2B website on Vercel.

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- GitHub repository connected to Vercel
- All required API keys and credentials (see Environment Variables section)

## Initial Setup

### 1. Install Vercel CLI (Optional)

```bash
npm install -g vercel
vercel login
```

### 2. Link Project to Vercel

```bash
vercel link
```

Follow the prompts to:
- Select your Vercel scope (personal or team)
- Link to existing project or create new one
- Confirm project settings

## Environment Configuration

### Production Environment Variables

Configure these in Vercel Dashboard → Project Settings → Environment Variables:

#### Sanity CMS

```
NEXT_PUBLIC_SANITY_PROJECT_ID=wqj6fzeq
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=<your_production_token>
SANITY_WEBHOOK_SECRET=<generate_secure_secret>
```

**Note**: Use a production-specific API token with appropriate permissions.

#### Resend Email Service
```
RESEND_API_KEY=<your_resend_api_key>
RESEND_FROM_EMAIL=noreply@afrexia.com
RESEND_TO_EMAIL=sales@afrexia.com
SALES_EMAIL=sales@afrexia.com
CONTACT_EMAIL=contact@afrexia.com
```

#### reCAPTCHA v3
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<your_site_key>
RECAPTCHA_SECRET_KEY=<your_secret_key>
```

**Setup**: https://www.google.com/recaptcha/admin

#### Mapbox
```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=<your_mapbox_token>
```

**Setup**: https://account.mapbox.com/access-tokens/

#### Analytics
```
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=afrexia.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=<your_ga4_id>
```

#### Sentry Error Tracking
```
NEXT_PUBLIC_SENTRY_DSN=<your_sentry_dsn>
SENTRY_AUTH_TOKEN=<your_sentry_auth_token>
SENTRY_ORG=<your_sentry_org>
SENTRY_PROJECT=<your_sentry_project>
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
```

**Setup**: https://sentry.io/settings/

#### Vercel KV (Rate Limiting)
```
KV_URL=<auto_generated_by_vercel>
KV_REST_API_URL=<auto_generated_by_vercel>
KV_REST_API_TOKEN=<auto_generated_by_vercel>
KV_REST_API_READ_ONLY_TOKEN=<auto_generated_by_vercel>
```

**Setup**: Create KV database in Vercel Dashboard → Storage → Create Database → KV

#### Application Settings
```
NEXT_PUBLIC_SITE_URL=https://afrexia.com
NODE_ENV=production
```

### Preview Environment Variables

For preview deployments, you can use the same values as production or create separate preview credentials.

Set environment variables to apply to:
- ✅ Production
- ✅ Preview
- ❌ Development (use .env.local)

## Custom Domain Setup

### 1. Add Domain in Vercel Dashboard

1. Go to Project Settings → Domains
2. Add your custom domain: `afrexia.com`
3. Add www subdomain: `www.afrexia.com`

### 2. Configure DNS Records

Add these DNS records in your domain registrar:

**For apex domain (afrexia.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Verification (optional):**
```
Type: TXT
Name: _vercel
Value: <verification_code_from_vercel>
```

### 3. SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt. This process takes a few minutes after DNS propagation.

## Deployment Workflow

### Automatic Deployments

**Production Deployments:**
- Triggered by pushes to `main` branch
- URL: https://afrexia.com
- Requires all checks to pass

**Preview Deployments:**
- Triggered by pull requests and pushes to other branches
- URL: https://<branch>-<project>.vercel.app
- Useful for testing before merging

### Manual Deployment via CLI

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Vercel KV Setup for Rate Limiting

### 1. Create KV Database

1. Go to Vercel Dashboard → Storage
2. Click "Create Database"
3. Select "KV" (Redis)
4. Name: `afrexia-rate-limiting`
5. Region: Same as your deployment region (iad1)

### 2. Connect to Project

1. Select your project
2. Vercel will automatically add environment variables
3. Redeploy to apply changes

### 3. Verify Connection

```bash
# Test rate limiting endpoint
curl -X POST https://afrexia.com/api/rfq \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## Sanity Webhook Configuration

### 1. Create Webhook in Sanity

1. Go to Sanity Dashboard → API → Webhooks
2. Click "Create webhook"
3. Name: `Vercel Revalidation`
4. URL: `https://afrexia.com/api/revalidate`
5. Dataset: `production`
6. Trigger on: Create, Update, Delete
7. HTTP method: POST
8. Secret: Use the value from `SANITY_WEBHOOK_SECRET`

### 2. Test Webhook

1. Make a change in Sanity Studio
2. Check Vercel logs for revalidation requests
3. Verify content updates on the website

## Build Configuration

### Build Settings in Vercel

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### Build Performance

Expected build times:
- Initial build: 3-5 minutes
- Incremental builds: 1-2 minutes

### Build Optimization

The project uses:
- Next.js App Router with React Server Components
- Incremental Static Regeneration (ISR)
- Image optimization via Next.js Image
- Code splitting and tree shaking

## Monitoring and Analytics

### Vercel Analytics

Automatically enabled for:
- Web Vitals (LCP, FID, CLS, TTFB)
- Real User Monitoring (RUM)
- Traffic analytics

Access: Vercel Dashboard → Analytics

### Sentry Error Tracking

Configured via `sentry.client.config.ts` and `sentry.server.config.ts`

Monitor errors: https://sentry.io/organizations/<org>/issues/

### Performance Monitoring

- **Vercel Speed Insights**: Real-time performance data
- **Lighthouse CI**: Automated performance audits (GitHub Actions)
- **Core Web Vitals**: Tracked via Vercel Analytics

## Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured in Vercel
- [ ] Custom domain added and DNS configured
- [ ] SSL certificate provisioned
- [ ] Vercel KV database created and connected
- [ ] Sanity webhook configured
- [ ] Sentry project created and DSN configured
- [ ] All tests passing (`npm run test:all`)
- [ ] Lighthouse scores meet targets (90+ mobile, 95+ desktop)
- [ ] Forms tested in production environment
- [ ] Email delivery verified
- [ ] Rate limiting tested
- [ ] Analytics tracking verified
- [ ] Error tracking verified

## Troubleshooting

### Build Failures

**Issue**: Build fails with module not found
```bash
# Solution: Clear cache and rebuild
vercel --force
```

**Issue**: Environment variables not available
- Check variable names match exactly
- Ensure variables are set for correct environment
- Redeploy after adding variables

### Runtime Errors

**Issue**: 500 Internal Server Error
- Check Vercel logs: Dashboard → Deployments → [deployment] → Logs
- Check Sentry for error details
- Verify all environment variables are set

**Issue**: Images not loading
- Verify Sanity CDN is in `remotePatterns` in next.config.ts
- Check image URLs in browser network tab
- Ensure SANITY_PROJECT_ID is correct

### Performance Issues

**Issue**: Slow page loads
- Check Vercel Analytics for bottlenecks
- Review bundle size: `npm run analyze`
- Verify ISR revalidation times
- Check Core Web Vitals

## Rollback Procedure

### Via Vercel Dashboard

1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Via CLI

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>
```

## Support and Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Vercel Support**: https://vercel.com/support
- **Project Repository**: [Your GitHub repo URL]

## Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **API Keys**: Rotate keys regularly
3. **Webhook Secrets**: Use strong, random secrets
4. **HTTPS**: Always enforced by Vercel
5. **Security Headers**: Configured in next.config.ts
6. **Rate Limiting**: Implemented via Vercel KV

## Maintenance

### Regular Tasks

- **Weekly**: Review Vercel Analytics and Sentry errors
- **Monthly**: Check for dependency updates
- **Quarterly**: Rotate API keys and secrets
- **As needed**: Update content via Sanity CMS

### Monitoring Alerts

Configure alerts in:
- Sentry: Critical errors, performance degradation
- Vercel: Build failures, deployment issues
- Uptime monitoring: Use service like UptimeRobot or Pingdom

## Cost Estimation

**Vercel Pro Plan** (recommended for production):
- Base: $20/month per member
- Bandwidth: Included up to 1TB
- Build time: Included up to 6,000 minutes
- Serverless function executions: Included up to 1M

**Additional Services**:
- Vercel KV: ~$10/month for basic usage
- Sanity: Free tier or $99/month for Growth
- Resend: Free tier or $20/month for Pro
- Sentry: Free tier or $26/month for Team
- Mapbox: Free tier or pay-as-you-go

**Total estimated monthly cost**: $50-200 depending on traffic and usage.
