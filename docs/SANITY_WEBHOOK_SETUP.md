# Sanity Webhook Configuration Guide

This guide provides step-by-step instructions for configuring the Sanity webhook to enable automatic content revalidation on the Afrexia website.

## Overview

The Sanity webhook integration enables **Incremental Static Regeneration (ISR)** by automatically revalidating cached pages when content is updated in the Sanity CMS. This ensures that content changes are reflected on the website within seconds without requiring a full rebuild.

**Requirements**: 4.2

## Prerequisites

Before configuring the webhook, ensure:

1. ✅ The website is deployed to Vercel (production or preview environment)
2. ✅ The `/api/revalidate` endpoint is deployed and accessible
3. ✅ You have admin access to the Sanity project dashboard
4. ✅ `SANITY_WEBHOOK_SECRET` environment variable is configured in Vercel

## Step 1: Generate Webhook Secret

The webhook secret is used to verify that revalidation requests come from Sanity and not malicious actors.

### Generate a Secure Secret

Use one of these methods to generate a strong random secret:

**Option A: Using OpenSSL (Linux/Mac)**
```bash
openssl rand -base64 32
```

**Option B: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option C: Using Online Generator**
Visit: https://generate-secret.vercel.app/32

**Example output:**
```
Xk7mP9vQ2wR5tY8uI1oL4nM6bV3cZ0aS1dF2gH3jK4l=
```

⚠️ **Important**: Save this secret securely. You'll need it for both Vercel and Sanity configuration.

## Step 2: Configure Environment Variable in Vercel

### Via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (afrexia-website)
3. Navigate to **Settings** → **Environment Variables**
4. Add new environment variable:
   - **Key**: `SANITY_WEBHOOK_SECRET`
   - **Value**: The secret generated in Step 1
   - **Environments**: Select all (Production, Preview, Development)
5. Click **Save**

### Via Vercel CLI

```bash
# Set for production
vercel env add SANITY_WEBHOOK_SECRET production

# Set for preview
vercel env add SANITY_WEBHOOK_SECRET preview

# Paste your secret when prompted
```

### Redeploy to Apply Changes

After adding the environment variable, trigger a new deployment:

```bash
# Via CLI
vercel --prod

# Or via Dashboard
# Go to Deployments → Redeploy
```

## Step 3: Configure Webhook in Sanity Dashboard

### Access Sanity Dashboard

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project: **Afrexia**
3. Navigate to **API** → **Webhooks**

### Create New Webhook

Click **"Create webhook"** or **"Add webhook"** and configure:

#### Basic Settings

- **Name**: `Vercel Production Revalidation`
- **Description**: `Automatically revalidate ISR pages when content changes`

#### URL Configuration

- **URL**: `https://afrexia.com/api/revalidate`
  - For preview environment: `https://preview.afrexia.com/api/revalidate`
  - For development: `https://your-preview-url.vercel.app/api/revalidate`

#### Dataset

- **Dataset**: `production`
  - This ensures the webhook only triggers for production content changes

#### Trigger Configuration

Select when the webhook should fire:

- ✅ **Create** - When new documents are created
- ✅ **Update** - When documents are updated
- ✅ **Delete** - When documents are deleted

#### Document Types (Optional)

You can filter which document types trigger the webhook. For optimal performance, select:

- ✅ `product`
- ✅ `blogPost`
- ✅ `certification`
- ✅ `resource`
- ✅ `teamMember`
- ✅ `page`

Leave empty to trigger on all document types.

#### HTTP Configuration

- **HTTP Method**: `POST`
- **HTTP Headers**: Leave empty (signature is sent automatically)

#### Secret

- **Secret**: Paste the same secret from Step 1
- This enables HMAC signature verification

#### Projection (Optional)

Use this GROQ projection to send only necessary data:

```groq
{
  _type,
  _id,
  "slug": slug.current,
  i18nId
}
```

This reduces payload size and improves performance.

#### API Version

- **API Version**: `2024-01-01` (or your configured version)

### Save Webhook

Click **"Save"** or **"Create"** to activate the webhook.

## Step 4: Test Webhook Configuration

### Method 1: Test via Sanity Dashboard

1. In the webhook configuration, click **"Test webhook"**
2. Sanity will send a test payload to your endpoint
3. Check the response:
   - ✅ **200 OK**: Webhook is configured correctly
   - ❌ **401 Unauthorized**: Secret mismatch
   - ❌ **500 Error**: Check Vercel logs for details

### Method 2: Test with Real Content Update

1. Open Sanity Studio: `https://afrexia.com/studio`
2. Edit any document (e.g., a product)
3. Make a small change (e.g., update description)
4. Click **"Publish"**
5. Wait 5-10 seconds
6. Visit the corresponding page on the website
7. Verify the change is reflected

### Method 3: Test via cURL

```bash
# Generate test signature
SECRET="your_webhook_secret"
PAYLOAD='{"_type":"product","_id":"test","slug":{"current":"test-product"}}'
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | sed 's/^.* //')

# Send test request
curl -X POST https://afrexia.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "sanity-webhook-signature: sha256=$SIGNATURE" \
  -d "$PAYLOAD"
```

**Expected response:**
```json
{
  "revalidated": true,
  "paths": ["/fr/products/test-product", "/en/products/test-product", "/fr/products", "/en/products", "/fr", "/en"],
  "timestamp": 1706234567890
}
```

## Step 5: Monitor Webhook Activity

### Via Sanity Dashboard

1. Go to **API** → **Webhooks**
2. Click on your webhook
3. View **"Recent deliveries"** tab
4. Check delivery status and response codes

### Via Vercel Logs

1. Go to Vercel Dashboard → **Deployments**
2. Select your production deployment
3. Click **"Logs"** or **"Functions"**
4. Filter by `/api/revalidate`
5. Look for revalidation logs:

```
Revalidated paths for product: ['/fr/products/cacao-beans', '/en/products/cacao-beans', ...]
```

### Via Sentry (Error Tracking)

If webhook requests fail, errors are logged to Sentry:

1. Go to [Sentry Dashboard](https://sentry.io)
2. Select your project
3. Filter by `endpoint:/api/revalidate`
4. Review error details and stack traces

## Troubleshooting

### Issue: 401 Unauthorized Error

**Cause**: Webhook signature verification failed

**Solutions**:
1. Verify the secret in Vercel matches the secret in Sanity
2. Check for extra spaces or newlines in the secret
3. Ensure the secret is set for the correct environment (production/preview)
4. Redeploy after updating the environment variable

**Debug**:
```bash
# Check if environment variable is set
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
cat .env.local | grep SANITY_WEBHOOK_SECRET
```

### Issue: 500 Internal Server Error

**Cause**: Error in revalidation logic

**Solutions**:
1. Check Vercel function logs for error details
2. Verify the payload structure matches expected format
3. Check Sentry for detailed error traces
4. Ensure all required fields are present in payload

**Debug**:
```bash
# View recent function logs
vercel logs --follow

# Check specific function
vercel logs /api/revalidate
```

### Issue: Webhook Not Triggering

**Cause**: Webhook configuration issue

**Solutions**:
1. Verify webhook is enabled in Sanity dashboard
2. Check dataset matches (production vs. development)
3. Ensure document type is included in trigger filters
4. Verify URL is correct and accessible

**Test connectivity**:
```bash
# Test if endpoint is accessible
curl -I https://afrexia.com/api/revalidate

# Should return: HTTP/2 405 (Method Not Allowed for GET)
# This confirms the endpoint exists
```

### Issue: Content Not Updating

**Cause**: Revalidation successful but content not refreshing

**Solutions**:
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check ISR revalidate time in page component
3. Verify Sanity query is fetching latest data
4. Check if CDN caching is interfering

**Debug**:
```bash
# Check page headers for cache status
curl -I https://afrexia.com/fr/products/cacao-beans

# Look for:
# x-vercel-cache: MISS (fresh data)
# x-vercel-cache: HIT (cached data)
# x-vercel-cache: STALE (revalidating)
```

### Issue: Too Many Revalidations

**Cause**: Webhook triggering too frequently

**Solutions**:
1. Add document type filters to webhook
2. Increase ISR revalidate time in pages
3. Implement debouncing in webhook handler
4. Use draft mode for preview instead of revalidation

## Webhook Payload Structure

The webhook sends this payload structure:

```typescript
interface SanityWebhookPayload {
  _type: string;           // Document type (e.g., 'product', 'blogPost')
  _id: string;             // Document ID
  slug?: {                 // Document slug (if available)
    current: string;
    _type: string;
  };
  i18nId?: string;         // Translation ID for multilingual content
}
```

## Revalidation Logic

The `/api/revalidate` endpoint revalidates paths based on document type:

| Document Type | Revalidated Paths |
|--------------|-------------------|
| `product` | `/[locale]/products/[slug]`, `/[locale]/products`, `/[locale]` |
| `blogPost` | `/[locale]/blog/[slug]`, `/[locale]/blog`, `/[locale]` |
| `certification` | `/[locale]/quality`, `/[locale]` |
| `resource` | `/[locale]/resources`, `/[locale]` |
| `teamMember` | `/[locale]/about`, `/[locale]` |
| `page` | `/[locale]/[slug]`, `/[locale]` |
| Other | `/[locale]` (homepage only) |

All paths are revalidated for both French (`/fr`) and English (`/en`) locales.

## Security Considerations

### HMAC Signature Verification

The webhook uses HMAC-SHA256 signature verification to ensure requests come from Sanity:

```typescript
const hash = createHmac('sha256', secret)
  .update(body)
  .digest('hex');

const expectedSignature = `sha256=${hash}`;
```

### Best Practices

1. **Use Strong Secrets**: Generate secrets with at least 32 bytes of entropy
2. **Rotate Secrets**: Change webhook secrets every 6-12 months
3. **Monitor Activity**: Regularly review webhook delivery logs
4. **Rate Limiting**: Consider implementing rate limiting for webhook endpoint
5. **IP Allowlisting**: Optionally restrict webhook endpoint to Sanity IPs

### Sanity IP Addresses

If you want to restrict webhook access by IP, allowlist these Sanity IPs:

```
34.120.192.0/23
34.120.194.0/24
```

## Performance Optimization

### Selective Revalidation

Only revalidate paths that are affected by the content change:

```typescript
// Good: Specific revalidation
revalidatePath(`/fr/products/${slug}`);

// Avoid: Blanket revalidation
revalidatePath('/fr/*');
```

### Batch Revalidation

For bulk content updates, consider:

1. Disabling webhook temporarily
2. Making all changes
3. Re-enabling webhook
4. Manually triggering revalidation

### ISR Configuration

Balance freshness vs. performance:

```typescript
// Frequent updates (products)
export const revalidate = 60; // 1 minute

// Moderate updates (blog)
export const revalidate = 300; // 5 minutes

// Rare updates (static pages)
export const revalidate = 3600; // 1 hour
```

## Additional Resources

- [Sanity Webhooks Documentation](https://www.sanity.io/docs/webhooks)
- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Vercel Deployment Documentation](https://vercel.com/docs/deployments/overview)
- [HMAC Signature Verification](https://en.wikipedia.org/wiki/HMAC)

## Support

If you encounter issues not covered in this guide:

1. Check Vercel function logs
2. Review Sentry error reports
3. Test webhook with cURL
4. Contact Sanity support: https://www.sanity.io/help
5. Contact Vercel support: https://vercel.com/support

## Checklist

Use this checklist to verify webhook configuration:

- [ ] Webhook secret generated (32+ bytes)
- [ ] `SANITY_WEBHOOK_SECRET` set in Vercel
- [ ] Website redeployed after adding secret
- [ ] Webhook created in Sanity dashboard
- [ ] Webhook URL points to production endpoint
- [ ] Dataset set to `production`
- [ ] Triggers enabled (Create, Update, Delete)
- [ ] Secret added to webhook configuration
- [ ] Test webhook successful (200 OK response)
- [ ] Real content update triggers revalidation
- [ ] Changes reflected on website within 60 seconds
- [ ] Webhook deliveries monitored in Sanity dashboard
- [ ] Revalidation logs visible in Vercel
- [ ] No errors in Sentry

---

**Last Updated**: January 2026  
**Requirements**: 4.2  
**Related Documentation**: 
- [Deployment Guide](./DEPLOYMENT.md)
- [CMS Workflow Guide](./cms/workflow-guide.md)
