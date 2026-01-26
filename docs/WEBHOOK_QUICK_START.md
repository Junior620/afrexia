# Sanity Webhook Quick Start Guide

**5-minute setup guide for Sanity webhook configuration**

## Prerequisites

- ✅ Website deployed to Vercel
- ✅ Admin access to Sanity project
- ✅ Terminal access for generating secret

## Quick Setup Steps

### 1. Generate Secret (30 seconds)

```bash
openssl rand -base64 32
```

Copy the output (e.g., `Xk7mP9vQ2wR5tY8uI1oL4nM6bV3cZ0aS1dF2gH3jK4l=`)

### 2. Add to Vercel (1 minute)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select project → **Settings** → **Environment Variables**
3. Add:
   - Key: `SANITY_WEBHOOK_SECRET`
   - Value: [paste secret from step 1]
   - Environments: All
4. Click **Save**
5. Redeploy: **Deployments** → **Redeploy**

### 3. Configure Sanity Webhook (2 minutes)

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select project → **API** → **Webhooks** → **Create webhook**
3. Configure:
   - **Name**: `Vercel Production Revalidation`
   - **URL**: `https://afrexia.com/api/revalidate`
   - **Dataset**: `production`
   - **Triggers**: ✅ Create, ✅ Update, ✅ Delete
   - **HTTP Method**: `POST`
   - **Secret**: [paste secret from step 1]
4. Click **Save**

### 4. Test (1 minute)

1. In Sanity webhook settings, click **"Test webhook"**
2. Verify response: `200 OK`
3. Or edit any content in Sanity Studio and publish
4. Check website updates within 60 seconds

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Verify secret matches in both Vercel and Sanity |
| 500 Error | Check Vercel logs for details |
| Not triggering | Verify dataset is `production` |
| Content not updating | Clear browser cache (Ctrl+Shift+R) |

## Verification Commands

```bash
# Check environment variable
vercel env ls

# View webhook logs
vercel logs /api/revalidate

# Test endpoint
curl -I https://afrexia.com/api/revalidate
```

## What Gets Revalidated?

| Content Type | Revalidated Pages |
|--------------|-------------------|
| Product | Product page + listing + homepage |
| Blog Post | Blog post + listing + homepage |
| Certification | Quality page + homepage |
| Resource | Resources page + homepage |
| Team Member | About page + homepage |

All pages revalidated in both French and English.

## Next Steps

- Monitor webhook deliveries in Sanity dashboard
- Check Vercel logs for revalidation activity
- Review [Full Documentation](./SANITY_WEBHOOK_SETUP.md) for advanced configuration

---

**Requirements**: 4.2  
**Full Guide**: [SANITY_WEBHOOK_SETUP.md](./SANITY_WEBHOOK_SETUP.md)
