#!/bin/bash

# Sanity Webhook Test Script
# Tests the /api/revalidate endpoint with a mock webhook payload
# Requirements: 4.2

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔗 Sanity Webhook Test Script"
echo "=============================="
echo ""

# Check if required environment variables are set
if [ -z "$SANITY_WEBHOOK_SECRET" ]; then
    echo -e "${RED}❌ Error: SANITY_WEBHOOK_SECRET environment variable is not set${NC}"
    echo ""
    echo "Please set it in your .env.local file or export it:"
    echo "  export SANITY_WEBHOOK_SECRET='your_secret_here'"
    exit 1
fi

# Get the site URL (default to localhost for development)
SITE_URL="${NEXT_PUBLIC_SITE_URL:-http://localhost:3000}"
ENDPOINT="$SITE_URL/api/revalidate"

echo "📍 Testing endpoint: $ENDPOINT"
echo ""

# Test payload
PAYLOAD='{"_type":"product","_id":"test-product-123","slug":{"current":"test-product","_type":"slug"},"i18nId":"test-product-i18n"}'

echo "📦 Payload:"
echo "$PAYLOAD" | jq '.' 2>/dev/null || echo "$PAYLOAD"
echo ""

# Generate HMAC signature
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SANITY_WEBHOOK_SECRET" | sed 's/^.* //')
SIGNATURE_HEADER="sha256=$SIGNATURE"

echo "🔐 Generated signature: $SIGNATURE_HEADER"
echo ""

# Send request
echo "📤 Sending webhook request..."
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "sanity-webhook-signature: $SIGNATURE_HEADER" \
  -d "$PAYLOAD")

# Extract HTTP status code (last line)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
# Extract response body (all but last line)
RESPONSE_BODY=$(echo "$RESPONSE" | sed '$d')

echo "📥 Response:"
echo "HTTP Status: $HTTP_CODE"
echo ""

# Pretty print JSON response if possible
echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"
echo ""

# Check response
if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Success! Webhook is configured correctly.${NC}"
    echo ""
    
    # Parse revalidated paths
    PATHS=$(echo "$RESPONSE_BODY" | jq -r '.paths[]' 2>/dev/null)
    if [ -n "$PATHS" ]; then
        echo "🔄 Revalidated paths:"
        echo "$PATHS" | while read -r path; do
            echo "  - $path"
        done
    fi
    
    exit 0
elif [ "$HTTP_CODE" -eq 401 ]; then
    echo -e "${RED}❌ Authentication failed (401 Unauthorized)${NC}"
    echo ""
    echo "Possible causes:"
    echo "  1. SANITY_WEBHOOK_SECRET doesn't match the secret in Vercel"
    echo "  2. Secret contains extra spaces or newlines"
    echo "  3. Secret is not set in the deployment environment"
    echo ""
    echo "Solutions:"
    echo "  1. Verify the secret in Vercel matches your local .env.local"
    echo "  2. Regenerate the secret and update both Vercel and Sanity"
    echo "  3. Redeploy after updating environment variables"
    exit 1
elif [ "$HTTP_CODE" -eq 400 ]; then
    echo -e "${RED}❌ Bad Request (400)${NC}"
    echo ""
    echo "The payload format is invalid. Check the error message above."
    exit 1
elif [ "$HTTP_CODE" -eq 500 ]; then
    echo -e "${RED}❌ Internal Server Error (500)${NC}"
    echo ""
    echo "Check the server logs for details:"
    echo "  vercel logs /api/revalidate"
    exit 1
elif [ "$HTTP_CODE" -eq 405 ]; then
    echo -e "${YELLOW}⚠️  Method Not Allowed (405)${NC}"
    echo ""
    echo "The endpoint exists but doesn't accept the request method."
    echo "This might indicate the endpoint is not properly configured."
    exit 1
elif [ "$HTTP_CODE" -eq 000 ] || [ -z "$HTTP_CODE" ]; then
    echo -e "${RED}❌ Connection failed${NC}"
    echo ""
    echo "Could not connect to $ENDPOINT"
    echo ""
    echo "Possible causes:"
    echo "  1. Development server is not running (run: npm run dev)"
    echo "  2. URL is incorrect"
    echo "  3. Network connectivity issues"
    exit 1
else
    echo -e "${RED}❌ Unexpected response (HTTP $HTTP_CODE)${NC}"
    exit 1
fi
