# Vercel KV Quick Start Guide

## 5-Minute Setup

This guide will get Vercel KV up and running for rate limiting in 5 minutes.

## Step 1: Create KV Database (2 minutes)

### Via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **Storage** tab
4. Click **Create Database**
5. Select **KV (Redis)**
6. Configure:
   - **Name**: `afrexia-rate-limiting`
   - **Region**: `iad1` (or closest to your users)
7. Click **Create**

### Via Vercel CLI

```bash
vercel kv create afrexia-rate-limiting
```

## Step 2: Connect to Project (1 minute)

Vercel automatically adds these environment variables to your project:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

**No manual configuration needed!**

## Step 3: Pull Environment Variables Locally (1 minute)

```bash
# Pull all environment variables from Vercel
vercel env pull .env.local

# Restart your development server
npm run dev
```

## Step 4: Test Connection (1 minute)

```bash
# Test KV connection
npm run test:kv
```

Expected output:
```
✓ All tests passed! Vercel KV is properly configured.
```

## Step 5: Test Rate Limiting (Optional)

```bash
# Make 6 requests to test rate limiting
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/rfq \
    -H "Content-Type: application/json" \
    -d '{
      "firstName": "Test",
      "lastName": "User",
      "email": "test@example.com",
      "phone": "+1234567890",
      "company": "Test Co",
      "country": "US",
      "productId": "test",
      "quantity": 100,
      "quantityUnit": "kg",
      "incoterm": "FOB",
      "destinationPort": "NY",
      "targetDate": "2024-12-31",
      "gdprConsent": true
    }'
  echo "\n--- Request $i ---"
  sleep 1
done
```

Expected:
- Requests 1-5: Success or validation errors
- Request 6: `429 Too Many Requests`

## Troubleshooting

### "Missing environment variables"

**Solution:**
```bash
vercel env pull .env.local
```

### "Cannot connect to KV"

**Solutions:**
1. Verify KV database exists in Vercel dashboard
2. Check environment variables are loaded: `echo $KV_URL`
3. Restart development server

### "Rate limiting not working"

**Solutions:**
1. Verify `@vercel/kv` is installed: `npm list @vercel/kv`
2. Check API routes are importing `kv` correctly
3. Review Vercel logs for errors

## What's Next?

- **Production Deployment**: KV works automatically in production
- **Monitoring**: View KV metrics in Vercel Dashboard → Storage
- **Detailed Docs**: See [VERCEL_KV_SETUP.md](./VERCEL_KV_SETUP.md)

## Rate Limiting Configuration

Current settings (in `app/api/rfq/route.ts` and `app/api/contact/route.ts`):
- **Window**: 60 seconds
- **Max Requests**: 5 per IP address

To adjust, modify these constants:
```typescript
const RATE_LIMIT_WINDOW = 60; // seconds
const RATE_LIMIT_MAX_REQUESTS = 5; // requests
```

## Support

- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Full Setup Guide](./VERCEL_KV_SETUP.md)
- [Deployment Guide](./DEPLOYMENT.md)
