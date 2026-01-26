# Deployment Quick Reference

Quick commands and procedures for common deployment tasks.

## Initial Setup

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project
vercel link
```

## Environment Variables

### Set via CLI
```bash
# Add single variable
vercel env add VARIABLE_NAME production

# Add from .env.local (use script)
./scripts/setup-vercel-env.sh
```

### Set via Dashboard
1. Go to https://vercel.com/dashboard
2. Select project → Settings → Environment Variables
3. Add variables for Production, Preview, or Development

## Deployment Commands

### Preview Deployment
```bash
# Deploy to preview environment
vercel

# Deploy specific branch
vercel --branch feature-name
```

### Production Deployment
```bash
# Deploy to production
vercel --prod

# Force rebuild (clear cache)
vercel --prod --force
```

## Domain Management

### Add Domain
```bash
# Add domain via CLI
vercel domains add afrexia.com

# Add www subdomain
vercel domains add www.afrexia.com
```

### DNS Configuration
```
# Apex domain (afrexia.com)
Type: A
Name: @
Value: 76.76.21.21

# WWW subdomain
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Vercel KV (Rate Limiting)

### Create Database
```bash
# Via CLI
vercel kv create afrexia-rate-limiting

# Via Dashboard
Dashboard → Storage → Create Database → KV
```

### Connect to Project
```bash
vercel kv connect
```

## Monitoring

### View Logs
```bash
# Real-time logs
vercel logs --follow

# Logs for specific deployment
vercel logs [deployment-url]

# Filter by function
vercel logs --function api/rfq
```

### Check Deployment Status
```bash
# List deployments
vercel ls

# Get deployment details
vercel inspect [deployment-url]
```

## Rollback

### Via CLI
```bash
# List deployments
vercel ls

# Promote previous deployment to production
vercel promote [deployment-url]

# Or use rollback command
vercel rollback [deployment-url]
```

### Via Dashboard
1. Go to Deployments
2. Find working deployment
3. Click "..." → "Promote to Production"

## Troubleshooting

### Clear Build Cache
```bash
vercel --force
```

### Check Environment Variables
```bash
# List all environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
```

### View Build Logs
```bash
# Get latest deployment URL
vercel ls

# View logs
vercel logs [deployment-url]
```

### Test Locally with Production Build
```bash
# Build production version
npm run build

# Start production server
npm run start
```

## Sanity Webhook

### Webhook URL
```
https://afrexia.com/api/revalidate
```

### Test Webhook
```bash
curl -X POST https://afrexia.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "sanity-webhook-signature: sha256=YOUR_SIGNATURE" \
  -d '{"_type":"product","slug":{"current":"test"}}'
```

## Performance Checks

### Run Lighthouse
```bash
npm run lighthouse
```

### Analyze Bundle
```bash
npm run analyze
```

### Check Core Web Vitals
- Vercel Dashboard → Analytics → Web Vitals
- Or use: https://pagespeed.web.dev/

## Security

### Rotate API Keys
1. Generate new key in service dashboard
2. Update in Vercel: Settings → Environment Variables
3. Redeploy: `vercel --prod`
4. Revoke old key

### Update Webhook Secret
```bash
# Generate new secret
openssl rand -hex 32

# Update in Vercel
vercel env add SANITY_WEBHOOK_SECRET production

# Update in Sanity Dashboard
# API → Webhooks → Edit webhook → Update secret

# Redeploy
vercel --prod
```

## Common Issues

### Build Fails
```bash
# Check build locally
npm run build

# Clear cache and rebuild
vercel --force

# Check environment variables
vercel env ls
```

### Images Not Loading
- Verify Sanity CDN in next.config.ts remotePatterns
- Check NEXT_PUBLIC_SANITY_PROJECT_ID is correct
- Verify image URLs in browser network tab

### Forms Not Working
- Check Resend API key is set
- Verify reCAPTCHA keys are correct
- Check rate limiting (Vercel KV connected)
- Review API route logs: `vercel logs --function api/rfq`

### Slow Performance
- Check Vercel Analytics for bottlenecks
- Run bundle analysis: `npm run analyze`
- Review ISR revalidation times
- Check Core Web Vitals

## Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Sanity Dashboard**: https://www.sanity.io/manage
- **Sentry Dashboard**: https://sentry.io/
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Checklist**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

## Emergency Contacts

- **Technical Lead**: [Add contact]
- **Vercel Support**: https://vercel.com/support
- **Sanity Support**: https://www.sanity.io/contact
- **On-Call**: [Add contact]

## Status Pages

- **Vercel Status**: https://www.vercel-status.com/
- **Sanity Status**: https://status.sanity.io/
- **Resend Status**: https://status.resend.com/
- **Mapbox Status**: https://status.mapbox.com/
