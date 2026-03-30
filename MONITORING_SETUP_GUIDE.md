# Monitoring Setup Guide - Production Deployment

## Overview

This guide helps you configure Sentry and Vercel Analytics before or immediately after production deployment.

## 1. Sentry Setup (Error Tracking)

### Step 1: Create Sentry Project

1. Go to https://sentry.io/ and sign in (or create account)
2. Click "Create Project"
3. Select "Next.js" as platform
4. Name: `afrexia-website`
5. Click "Create Project"

### Step 2: Get Configuration Values

After project creation, you'll see:

```
DSN: https://[key]@o[org-id].ingest.sentry.io/[project-id]
```

Copy this DSN value.

### Step 3: Generate Auth Token

1. Go to Settings → Account → API → Auth Tokens
2. Click "Create New Token"
3. Scopes needed:
   - `project:read`
   - `project:releases`
   - `org:read`
4. Copy the token (shown only once!)

### Step 4: Get Organization Slug

1. Go to Settings → General Settings
2. Copy the "Organization Slug" value

### Step 5: Add to Vercel

1. Go to Vercel dashboard → Your Project → Settings → Environment Variables
2. Add these variables for **Production** environment:

```
NEXT_PUBLIC_SENTRY_DSN=https://[your-key]@o[org-id].ingest.sentry.io/[project-id]
SENTRY_AUTH_TOKEN=[your-auth-token]
SENTRY_ORG=[your-org-slug]
SENTRY_PROJECT=afrexia-website
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
```

### Step 6: Configure Alerts

Follow the detailed guide in `docs/sentry-alerting-setup.md` to set up:
- Critical error alerts
- Performance degradation alerts
- Email/Slack notifications

## 2. Vercel Analytics Setup

### Step 1: Enable Analytics

1. Go to Vercel dashboard → Your Project
2. Click "Analytics" tab
3. Click "Enable Analytics"
4. Choose plan (Free tier is sufficient for V1)

### Step 2: Verify Configuration

Vercel automatically injects the analytics script. No code changes needed.

After deployment, verify:
1. Go to Analytics tab
2. Wait 5-10 minutes after deployment
3. Check that data is appearing

## 3. Google Search Console (Optional but Recommended)

### Step 1: Verify Domain

1. Go to https://search.google.com/search-console
2. Add property: `afrexia.com`
3. Verify ownership (DNS or HTML file method)

### Step 2: Submit Sitemap

1. In Search Console, go to Sitemaps
2. Add new sitemap: `https://afrexia.com/sitemap.xml`
3. Click "Submit"

### Step 3: Monitor Indexation

Check weekly:
- Coverage report (indexed vs not indexed)
- Performance (impressions, clicks)
- Core Web Vitals

## 4. Testing Monitoring Setup

### Test Sentry

Trigger a test error to verify Sentry is working:

```bash
# In browser console on production site:
throw new Error("Test Sentry integration");
```

Check Sentry dashboard - error should appear within 1 minute.

### Test Vercel Analytics

1. Visit your production site
2. Navigate to a few pages
3. Wait 5-10 minutes
4. Check Vercel Analytics dashboard for page views

## 5. Monitoring Checklist

Before considering deployment complete:

- [ ] Sentry project created
- [ ] Sentry DSN configured in Vercel
- [ ] Sentry auth token configured
- [ ] Test error appears in Sentry dashboard
- [ ] Sentry alerts configured (email/Slack)
- [ ] Vercel Analytics enabled
- [ ] Analytics data appearing in dashboard
- [ ] Google Search Console verified (optional)
- [ ] Sitemap submitted to GSC (optional)

## Quick Reference

**Sentry Dashboard**: https://sentry.io/organizations/[your-org]/projects/afrexia-website/
**Vercel Analytics**: https://vercel.com/[your-team]/afrexia/analytics
**Google Search Console**: https://search.google.com/search-console

## Troubleshooting

### Sentry Not Receiving Events

1. Check DSN is correct in Vercel env vars
2. Verify environment is set to "production"
3. Check browser console for Sentry errors
4. Verify `beforeSend` filter isn't blocking events

### Analytics Not Showing Data

1. Wait 10-15 minutes after first deployment
2. Check ad blockers aren't blocking Vercel scripts
3. Verify Analytics is enabled in project settings
4. Try incognito/private browsing mode

### ISR Errors Not Logged

1. Check Sentry configuration in `sentry.server.config.ts`
2. Verify ISR error handler is imported in routes
3. Check Vercel function logs for errors
