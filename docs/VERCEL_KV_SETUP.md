# Vercel KV Setup Guide

## Overview

This guide explains how to set up Vercel KV (Redis) for rate limiting on the Afrexia website. Vercel KV is used to track and limit API requests to prevent abuse and protect the system from excessive requests.

## What is Vercel KV?

Vercel KV is a serverless Redis database that provides:
- **Fast key-value storage** for rate limiting counters
- **Automatic expiration** (TTL) for time-based rate limits
- **Global edge network** for low-latency access
- **Zero configuration** when deployed on Vercel

## Prerequisites

- Vercel account with the project deployed
- Access to the Vercel dashboard
- Project must be on a Vercel plan that supports KV (Hobby or Pro)

## Step 1: Create Vercel KV Database

### Option A: Via Vercel Dashboard (Recommended)

1. **Navigate to your project** in the Vercel dashboard
2. **Go to the Storage tab** in your project settings
3. **Click "Create Database"**
4. **Select "KV (Redis)"** from the database types
5. **Configure the database:**
   - **Name:** `afrexia-rate-limiting` (or any descriptive name)
   - **Region:** Choose the region closest to your primary users (e.g., `us-east-1` for North America, `eu-west-1` for Europe)
6. **Click "Create"**

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Create KV database
vercel kv create afrexia-rate-limiting
```

## Step 2: Connect KV to Your Project

After creating the database, Vercel will automatically:
1. Generate the required environment variables
2. Add them to your project's environment variables

The following environment variables will be created:
- `KV_URL` - Connection URL for the KV database
- `KV_REST_API_URL` - REST API endpoint
- `KV_REST_API_TOKEN` - Authentication token for write operations
- `KV_REST_API_READ_ONLY_TOKEN` - Authentication token for read-only operations

### Verify Environment Variables

1. Go to **Project Settings** → **Environment Variables**
2. Confirm these variables are present:
   ```
   KV_URL
   KV_REST_API_URL
   KV_REST_API_TOKEN
   KV_REST_API_READ_ONLY_TOKEN
   ```

## Step 3: Configure Local Development

For local development, you need to pull the environment variables to your local machine.

### Option A: Using Vercel CLI (Recommended)

```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# This will update your .env.local file with the KV credentials
```

### Option B: Manual Configuration

1. Go to **Project Settings** → **Environment Variables** in Vercel dashboard
2. Copy the values for:
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`
3. Update your `.env.local` file:

```bash
# Vercel KV (Rate Limiting)
KV_URL=redis://default:xxxxx@xxxxx.kv.vercel-storage.com:xxxxx
KV_REST_API_URL=https://xxxxx.kv.vercel-storage.com
KV_REST_API_TOKEN=xxxxx
KV_REST_API_READ_ONLY_TOKEN=xxxxx
```

## Step 4: Test Rate Limiting

### Test Locally

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test the RFQ endpoint:**
   ```bash
   # Make multiple requests to test rate limiting
   for i in {1..6}; do
     curl -X POST http://localhost:3000/api/rfq \
       -H "Content-Type: application/json" \
       -d '{
         "firstName": "Test",
         "lastName": "User",
         "email": "test@example.com",
         "phone": "+1234567890",
         "company": "Test Company",
         "country": "US",
         "productId": "test-product",
         "quantity": 100,
         "quantityUnit": "kg",
         "incoterm": "FOB",
         "destinationPort": "New York",
         "targetDate": "2024-12-31",
         "message": "Test message",
         "gdprConsent": true
       }'
     echo "\nRequest $i completed"
     sleep 1
   done
   ```

3. **Expected behavior:**
   - First 5 requests should succeed (or fail validation if missing required fields)
   - 6th request should return `429 Too Many Requests`

### Test in Production

After deploying to Vercel:

```bash
# Replace with your production URL
PROD_URL="https://afrexia.com"

for i in {1..6}; do
  curl -X POST $PROD_URL/api/rfq \
    -H "Content-Type: application/json" \
    -d '{...}'
  echo "\nRequest $i completed"
  sleep 1
done
```

## Step 5: Monitor KV Usage

### Via Vercel Dashboard

1. Go to **Storage** tab in your project
2. Click on your KV database
3. View metrics:
   - **Requests per day**
   - **Storage usage**
   - **Command distribution**

### Via Vercel CLI

```bash
# View KV database info
vercel kv ls

# View specific database details
vercel kv inspect afrexia-rate-limiting
```

## Rate Limiting Configuration

The rate limiting is configured in the API routes:

### Current Configuration

```typescript
// app/api/rfq/route.ts and app/api/contact/route.ts
const RATE_LIMIT_WINDOW = 60; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP
```

### How It Works

1. **Request arrives** at `/api/rfq` or `/api/contact`
2. **Extract client IP** from request headers
3. **Increment counter** in KV: `rate_limit:rfq:{ip}` or `rate_limit:contact:{ip}`
4. **Check limit:**
   - If counter ≤ 5: Allow request
   - If counter > 5: Return 429 error
5. **Set expiration** on first request (60 seconds)
6. **Counter resets** automatically after 60 seconds

### Adjusting Rate Limits

To change the rate limits, update the constants in the API routes:

```typescript
// More restrictive (3 requests per minute)
const RATE_LIMIT_WINDOW = 60;
const RATE_LIMIT_MAX_REQUESTS = 3;

// More lenient (10 requests per minute)
const RATE_LIMIT_WINDOW = 60;
const RATE_LIMIT_MAX_REQUESTS = 10;

// Longer window (10 requests per 5 minutes)
const RATE_LIMIT_WINDOW = 300; // 5 minutes
const RATE_LIMIT_MAX_REQUESTS = 10;
```

## Troubleshooting

### Issue: "Cannot connect to KV"

**Symptoms:**
- API requests fail with connection errors
- Logs show "ECONNREFUSED" or "KV connection failed"

**Solutions:**
1. Verify environment variables are set correctly
2. Check that KV database is active in Vercel dashboard
3. Ensure `@vercel/kv` package is installed: `npm install @vercel/kv`
4. Restart development server after updating `.env.local`

### Issue: Rate limiting not working

**Symptoms:**
- Can make unlimited requests without getting 429 errors
- Rate limit counter not incrementing

**Solutions:**
1. Check KV environment variables are loaded
2. Verify KV database is accessible
3. Check error logs in Sentry or Vercel logs
4. Test with `console.log` in `checkRateLimit` function

### Issue: Rate limiting too aggressive

**Symptoms:**
- Legitimate users getting blocked
- 429 errors on first request

**Solutions:**
1. Increase `RATE_LIMIT_MAX_REQUESTS` value
2. Increase `RATE_LIMIT_WINDOW` for longer time periods
3. Consider implementing different limits for authenticated vs. anonymous users
4. Add IP whitelist for trusted sources

### Issue: Local development not connecting to KV

**Symptoms:**
- Works in production but not locally
- "KV_URL is not defined" error

**Solutions:**
1. Run `vercel env pull .env.local` to sync environment variables
2. Manually copy KV variables from Vercel dashboard
3. Restart development server after updating `.env.local`
4. Check that `.env.local` is not in `.gitignore` (it should be)

## Security Best Practices

### 1. Never Commit KV Credentials

Ensure `.env.local` is in `.gitignore`:

```bash
# .gitignore
.env.local
.env*.local
```

### 2. Use Read-Only Tokens When Possible

For read-only operations, use `KV_REST_API_READ_ONLY_TOKEN` instead of `KV_REST_API_TOKEN`.

### 3. Rotate Tokens Regularly

1. Go to Vercel dashboard → Storage → KV database
2. Click "Regenerate Token"
3. Update environment variables in Vercel and locally

### 4. Monitor for Abuse

Set up alerts in Vercel dashboard for:
- Unusual spike in KV requests
- High error rates
- Storage quota approaching limit

## Cost Considerations

### Vercel KV Pricing (as of 2024)

- **Hobby Plan:** 256 MB storage, 3,000 commands/day (free)
- **Pro Plan:** 512 MB storage, 100,000 commands/day (included)
- **Enterprise:** Custom limits

### Estimating Usage

For rate limiting:
- Each API request = 2 KV commands (INCR + EXPIRE)
- 1,000 API requests/day = 2,000 KV commands/day
- Well within free tier limits for most use cases

### Optimizing Costs

1. **Use appropriate TTL:** Don't store data longer than needed
2. **Batch operations:** Combine multiple operations when possible
3. **Monitor usage:** Set up alerts before hitting limits
4. **Clean up old keys:** Implement cleanup for abandoned sessions

## Testing Checklist

Before marking this task as complete, verify:

- [ ] Vercel KV database created in Vercel dashboard
- [ ] Environment variables configured in Vercel project settings
- [ ] Local `.env.local` file updated with KV credentials
- [ ] Rate limiting works locally (6th request returns 429)
- [ ] Rate limiting works in production (after deployment)
- [ ] KV metrics visible in Vercel dashboard
- [ ] Error handling works when KV is unavailable
- [ ] Documentation updated with KV setup instructions

## Additional Resources

- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Vercel KV SDK Reference](https://vercel.com/docs/storage/vercel-kv/kv-reference)
- [Redis Commands Reference](https://redis.io/commands/)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)

## Support

If you encounter issues:
1. Check Vercel Status: https://www.vercel-status.com/
2. Review Vercel logs in dashboard
3. Check Sentry for error details
4. Contact Vercel support for KV-specific issues
