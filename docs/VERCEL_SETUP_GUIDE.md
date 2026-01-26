# Vercel Setup Guide - Step by Step

This guide walks you through setting up the Afrexia website on Vercel from scratch.

## Part 1: Vercel Account Setup

### Step 1: Create Vercel Account

1. Go to https://vercel.com/signup
2. Sign up with GitHub (recommended for automatic deployments)
3. Authorize Vercel to access your GitHub account

### Step 2: Import Project

1. Click "Add New..." → "Project"
2. Select your GitHub repository
3. Click "Import"

### Step 3: Configure Project Settings

**Framework Preset**: Next.js (auto-detected)

**Root Directory**: `./` (leave as default)

**Build Command**: `npm run build` (auto-detected)

**Output Directory**: `.next` (auto-detected)

**Install Command**: `npm install` (auto-detected)

Click "Deploy" to create initial deployment (it will fail without environment variables - that's expected)

## Part 2: Environment Variables Setup

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to your project → Settings → Environment Variables
2. Add each variable from the list below
3. Select which environments to apply to:
   - ✅ Production
   - ✅ Preview
   - ❌ Development (use .env.local instead)

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Use the setup script
./scripts/setup-vercel-env.sh
```

### Required Environment Variables

Copy these from your `.env.local` or `.env.production.template`:

#### Sanity CMS (Required)
```
NEXT_PUBLIC_SANITY_PROJECT_ID=wqj6fzeq
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=[your_production_token]
SANITY_WEBHOOK_SECRET=[generate_with: openssl rand -hex 32]
```

#### Resend Email (Required)
```
RESEND_API_KEY=[from_resend_dashboard]
RESEND_FROM_EMAIL=noreply@afrexia.com
RESEND_TO_EMAIL=sales@afrexia.com
SALES_EMAIL=sales@afrexia.com
CONTACT_EMAIL=contact@afrexia.com
```

#### reCAPTCHA v3 (Required)
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=[from_google_recaptcha]
RECAPTCHA_SECRET_KEY=[from_google_recaptcha]
```

#### Mapbox (Required)
```
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=[from_mapbox_dashboard]
```

#### Analytics (Optional but Recommended)
```
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=afrexia.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=[from_google_analytics]
```

#### Sentry (Optional but Recommended)
```
NEXT_PUBLIC_SENTRY_DSN=[from_sentry_dashboard]
SENTRY_AUTH_TOKEN=[from_sentry_dashboard]
SENTRY_ORG=[your_sentry_org]
SENTRY_PROJECT=[your_sentry_project]
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
```

#### Application (Required)
```
NEXT_PUBLIC_SITE_URL=https://afrexia.com
NODE_ENV=production
```

#### Vercel KV (Setup in Part 3)
```
KV_URL=[auto_generated]
KV_REST_API_URL=[auto_generated]
KV_REST_API_TOKEN=[auto_generated]
KV_REST_API_READ_ONLY_TOKEN=[auto_generated]
```

## Part 3: Vercel KV Setup (Rate Limiting)

### Step 1: Create KV Database

1. In Vercel Dashboard, go to "Storage" tab
2. Click "Create Database"
3. Select "KV" (Redis)
4. Name: `afrexia-rate-limiting`
5. Region: `Washington, D.C., USA (iad1)` (same as deployment)
6. Click "Create"

### Step 2: Connect to Project

1. Click "Connect Project"
2. Select your Afrexia project
3. Vercel will automatically add KV environment variables
4. Click "Connect"

### Step 3: Verify Connection

The following variables should now be in your environment variables:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

## Part 4: Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Go to Project Settings → Domains
2. Click "Add"
3. Enter: `afrexia.com`
4. Click "Add"
5. Repeat for: `www.afrexia.com`

### Step 2: Configure DNS

Go to your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare) and add:

**For apex domain (afrexia.com):**
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: 3600 (or Auto)
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

### Step 3: Wait for DNS Propagation

- DNS changes can take 5 minutes to 48 hours
- Check status: https://dnschecker.org/
- Vercel will automatically provision SSL certificate once DNS is verified

### Step 4: Set Primary Domain

1. In Vercel Domains settings
2. Click "..." next to `afrexia.com`
3. Select "Set as Primary"
4. This makes `www.afrexia.com` redirect to `afrexia.com`

## Part 5: Redeploy

After setting up environment variables and KV:

1. Go to Deployments tab
2. Click "..." on the latest deployment
3. Click "Redeploy"
4. Or push a new commit to trigger automatic deployment

## Part 6: Sanity Webhook Configuration

### Step 1: Get Webhook URL

Your webhook URL is: `https://afrexia.com/api/revalidate`

### Step 2: Configure in Sanity

1. Go to https://www.sanity.io/manage
2. Select your project
3. Go to API → Webhooks
4. Click "Create webhook"
5. Fill in:
   - **Name**: Vercel Revalidation
   - **URL**: `https://afrexia.com/api/revalidate`
   - **Dataset**: production
   - **Trigger on**: Create, Update, Delete
   - **HTTP method**: POST
   - **HTTP Headers**: (leave empty)
   - **Secret**: Use the value from `SANITY_WEBHOOK_SECRET` environment variable
   - **Projection**: (leave default)
   - **Filter**: (leave empty to trigger on all changes)
6. Click "Save"

### Step 3: Test Webhook

1. Make a change in Sanity Studio (e.g., edit a product)
2. Go to Vercel → Deployments → [latest] → Logs
3. Look for revalidation requests
4. Verify content updates on website within 60 seconds

## Part 7: GitHub Actions Setup (Optional)

For automated deployment checks on pull requests:

### Step 1: Get Vercel Tokens

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name: `GitHub Actions`
4. Scope: Full Account
5. Copy the token

### Step 2: Get Project IDs

```bash
# Install Vercel CLI
npm install -g vercel

# Link project
vercel link

# Get IDs from .vercel/project.json
cat .vercel/project.json
```

### Step 3: Add GitHub Secrets

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add these secrets:
   - `VERCEL_TOKEN`: [token from step 1]
   - `VERCEL_ORG_ID`: [from .vercel/project.json]
   - `VERCEL_PROJECT_ID`: [from .vercel/project.json]
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`: wqj6fzeq
   - `NEXT_PUBLIC_SANITY_DATASET`: production
   - `NEXT_PUBLIC_SANITY_API_VERSION`: 2024-01-01

### Step 4: Verify Workflow

1. Create a pull request
2. Check Actions tab for workflow runs
3. Workflow should:
   - Run tests
   - Build project
   - Deploy preview
   - Comment preview URL on PR

## Part 8: Monitoring Setup

### Vercel Analytics (Built-in)

Already enabled! View at: Project → Analytics

### Sentry Error Tracking

1. Create account at https://sentry.io/
2. Create new project (Next.js)
3. Copy DSN and add to environment variables
4. Generate auth token for source maps
5. Add to environment variables
6. Redeploy

### Plausible Analytics

1. Create account at https://plausible.io/
2. Add site: `afrexia.com`
3. Copy tracking script (already in code)
4. Verify tracking in Plausible dashboard

### Google Analytics 4

1. Create account at https://analytics.google.com/
2. Create property for `afrexia.com`
3. Copy Measurement ID (G-XXXXXXXXXX)
4. Add to environment variables
5. Redeploy

## Part 9: Final Verification

### Checklist

- [ ] Website loads at https://afrexia.com
- [ ] SSL certificate is active (padlock icon)
- [ ] All pages accessible
- [ ] Forms submit successfully
- [ ] Emails are received
- [ ] Maps load correctly
- [ ] Images optimized (check Network tab)
- [ ] Analytics tracking (check dashboards)
- [ ] Error tracking (test with intentional error)
- [ ] Rate limiting works (test multiple form submissions)
- [ ] Content updates from Sanity (test webhook)

### Performance Check

Run Lighthouse audit:
```bash
npm run lighthouse
```

Or use: https://pagespeed.web.dev/

**Target Scores:**
- Performance: 90+ (mobile), 95+ (desktop)
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

## Part 10: Ongoing Maintenance

### Daily
- Monitor Vercel Analytics for traffic
- Check Sentry for errors

### Weekly
- Review form submissions
- Check email delivery rates
- Monitor performance metrics

### Monthly
- Update dependencies
- Review and rotate API keys
- Check for security updates
- Analyze traffic patterns

## Troubleshooting

### Build Fails

**Check:**
1. Environment variables are set correctly
2. All required variables are present
3. Build works locally: `npm run build`

**Solution:**
```bash
# Clear cache and rebuild
vercel --force
```

### Domain Not Working

**Check:**
1. DNS records are correct
2. DNS has propagated (use dnschecker.org)
3. Domain is verified in Vercel

**Wait:** DNS can take up to 48 hours

### Forms Not Working

**Check:**
1. Resend API key is valid
2. reCAPTCHA keys are correct
3. Vercel KV is connected
4. Check function logs: Deployments → [latest] → Logs

### Images Not Loading

**Check:**
1. Sanity project ID is correct
2. Sanity CDN is in next.config.ts
3. Images exist in Sanity

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Support**: https://vercel.com/support
- **Vercel Status**: https://www.vercel-status.com/
- **Community**: https://github.com/vercel/next.js/discussions

## Next Steps

After successful deployment:

1. ✅ Complete [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)
2. ✅ Train content team on Sanity CMS
3. ✅ Set up monitoring alerts
4. ✅ Document any custom configurations
5. ✅ Plan regular maintenance schedule

---

**Congratulations!** Your Afrexia website is now live on Vercel! 🎉
