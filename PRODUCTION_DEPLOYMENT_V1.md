# Production Deployment V1 - Checklist

**Date**: $(date +%Y-%m-%d)
**Task**: 10.4 Déployer en production
**Branch**: staging → main

## Pre-Deployment Status

✅ **Build Status**: Successful (400 static pages generated)
✅ **Tests**: All passing (unit, integration, property-based)
✅ **Staging Branch**: Created and pushed to origin
✅ **Documentation**: Complete (ARCHITECTURE.md, TESTING.md, DEPLOYMENT.md)

## Deployment Steps

### 1. Verify Vercel Preview Deployment

The staging branch push should trigger an automatic Vercel preview deployment.

**Action Required**:
- [ ] Check Vercel dashboard for preview deployment URL
- [ ] Test key pages on preview:
  - [ ] `/fr/produits/cacao/export-netherlands`
  - [ ] `/fr/prix/cacao-cameroun`
  - [ ] `/fr/guide/cacao-vs-cafe`
  - [ ] `/sitemap.xml`
- [ ] Verify build logs show no errors
- [ ] Check that ~400 pages were generated

### 2. Configure Monitoring (CRITICAL)

**Sentry Configuration**:

⚠️ **Current Status**: Sentry DSN is placeholder value

**Action Required**:
- [ ] Create Sentry project at https://sentry.io/
- [ ] Get DSN from project settings
- [ ] Add to Vercel environment variables:
  - `NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...`
  - `SENTRY_AUTH_TOKEN=...` (for source maps)
  - `SENTRY_ORG=your-org`
  - `SENTRY_PROJECT=afrexia-website`
- [ ] Configure alerts (see docs/sentry-alerting-setup.md)

**Vercel Analytics**:
- [ ] Enable Vercel Analytics in project settings
- [ ] Verify `NEXT_PUBLIC_VERCEL_ANALYTICS_ID` is set (auto-configured)

### 3. Merge Staging to Main

Once preview deployment is validated:

```bash
git checkout main
git merge staging --no-ff -m "chore: merge V1 programmatic SEO to production"
git push origin main
```

### 4. Monitor Production Deployment

Vercel will automatically deploy when main is updated.

**Immediate Checks (0-30 minutes)**:

- [ ] Verify deployment completes successfully in Vercel dashboard
- [ ] Check production URL: https://afrexia.com
- [ ] Test sample pages (same as preview testing)
- [ ] Verify sitemap: https://afrexia.com/sitemap.xml
- [ ] Check Sentry for any immediate errors
- [ ] Verify Vercel Analytics is receiving data

**First 24 Hours Monitoring**:
- [ ] Monitor Sentry dashboard for ISR errors
- [ ] Check Vercel Analytics for Core Web Vitals
- [ ] Verify TTFB < 2s on sample pages
- [ ] Monitor error rate (should be < 0.1%)
- [ ] Check Google Search Console for crawl errors

**Week 1 Monitoring**:
- [ ] Submit sitemap to Google Search Console
- [ ] Monitor indexation progress
- [ ] Review Sentry error patterns
- [ ] Check ISR revalidation logs

### 5. Rollback Plan (If Needed)

If critical issues occur:

**Option 1: Vercel Instant Rollback**
1. Go to Vercel dashboard → Deployments
2. Find last stable deployment
3. Click "Promote to Production"

**Option 2: Git Revert**
```bash
git revert HEAD
git push origin main
```

## Environment Variables Checklist


Verify these are set in Vercel production environment:

**Required for SEO**:
- [x] `NEXT_PUBLIC_SANITY_PROJECT_ID`
- [x] `NEXT_PUBLIC_SANITY_DATASET=production`
- [x] `SANITY_API_TOKEN`
- [x] `NEXT_PUBLIC_SITE_URL=https://afrexia.com`

**Required for Monitoring**:
- [ ] `NEXT_PUBLIC_SENTRY_DSN` ⚠️ NOT CONFIGURED
- [ ] `SENTRY_AUTH_TOKEN` ⚠️ NOT CONFIGURED
- [ ] `SENTRY_ORG` ⚠️ NOT CONFIGURED
- [ ] `SENTRY_PROJECT` ⚠️ NOT CONFIGURED

**Optional but Recommended**:
- [x] `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID`

## Success Criteria

Deployment is considered successful when:

- ✅ Build completes without errors
- ✅ All ~400 V1 pages are accessible
- ✅ Sitemap contains all indexable pages
- ✅ No critical errors in Sentry (first 24h)
- ✅ TTFB < 2s on sample pages
- ✅ Lighthouse score ≥ 90
- ✅ ISR revalidation working (check after 24h for price pages)

## Post-Deployment Tasks

After successful deployment:

1. Update task status in tasks.md (mark 10.4 complete)
2. Create GitHub release tag: `v1.0.0-seo-programmatic`
3. Document any issues encountered
4. Schedule V2 planning meeting

## Notes

- Staging branch will remain for future V2 development
- Monitor for 24h before considering deployment complete
- Keep DEPLOYMENT.md updated with any lessons learned
