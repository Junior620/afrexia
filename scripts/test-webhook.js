#!/usr/bin/env node

/**
 * Sanity Webhook Test Script
 * Tests the /api/revalidate endpoint with a mock webhook payload
 * Requirements: 4.2
 * 
 * Usage:
 *   node scripts/test-webhook.js
 *   npm run test:webhook
 */

const crypto = require('crypto');
const https = require('https');
const http = require('http');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

console.log('🔗 Sanity Webhook Test Script');
console.log('==============================\n');

// Check if secret is set
if (!WEBHOOK_SECRET) {
  logError('SANITY_WEBHOOK_SECRET environment variable is not set\n');
  console.log('Please set it in your .env.local file or export it:');
  console.log('  export SANITY_WEBHOOK_SECRET="your_secret_here"\n');
  process.exit(1);
}

// Test payload
const payload = {
  _type: 'product',
  _id: 'test-product-123',
  slug: {
    current: 'test-product',
    _type: 'slug',
  },
  i18nId: 'test-product-i18n',
};

const payloadString = JSON.stringify(payload);

console.log(`📍 Testing endpoint: ${SITE_URL}/api/revalidate\n`);
console.log('📦 Payload:');
console.log(JSON.stringify(payload, null, 2));
console.log('');

// Generate HMAC signature
const signature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(payloadString)
  .digest('hex');

const signatureHeader = `sha256=${signature}`;

console.log(`🔐 Generated signature: ${signatureHeader}\n`);
console.log('📤 Sending webhook request...\n');

// Parse URL
const url = new URL(`${SITE_URL}/api/revalidate`);
const isHttps = url.protocol === 'https:';
const client = isHttps ? https : http;

// Request options
const options = {
  hostname: url.hostname,
  port: url.port || (isHttps ? 443 : 80),
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payloadString),
    'sanity-webhook-signature': signatureHeader,
  },
};

// Send request
const req = client.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📥 Response:');
    console.log(`HTTP Status: ${res.statusCode}\n`);

    // Try to parse JSON response
    let responseBody;
    try {
      responseBody = JSON.parse(data);
      console.log(JSON.stringify(responseBody, null, 2));
    } catch (e) {
      console.log(data);
      responseBody = data;
    }
    console.log('');

    // Check response status
    if (res.statusCode === 200) {
      logSuccess('Success! Webhook is configured correctly.\n');

      if (responseBody && responseBody.paths) {
        console.log('🔄 Revalidated paths:');
        responseBody.paths.forEach((path) => {
          console.log(`  - ${path}`);
        });
        console.log('');
      }

      process.exit(0);
    } else if (res.statusCode === 401) {
      logError('Authentication failed (401 Unauthorized)\n');
      console.log('Possible causes:');
      console.log('  1. SANITY_WEBHOOK_SECRET doesn\'t match the secret in Vercel');
      console.log('  2. Secret contains extra spaces or newlines');
      console.log('  3. Secret is not set in the deployment environment\n');
      console.log('Solutions:');
      console.log('  1. Verify the secret in Vercel matches your local .env.local');
      console.log('  2. Regenerate the secret and update both Vercel and Sanity');
      console.log('  3. Redeploy after updating environment variables\n');
      process.exit(1);
    } else if (res.statusCode === 400) {
      logError('Bad Request (400)\n');
      console.log('The payload format is invalid. Check the error message above.\n');
      process.exit(1);
    } else if (res.statusCode === 500) {
      logError('Internal Server Error (500)\n');
      console.log('Check the server logs for details:');
      console.log('  vercel logs /api/revalidate\n');
      process.exit(1);
    } else if (res.statusCode === 405) {
      logWarning('Method Not Allowed (405)\n');
      console.log('The endpoint exists but doesn\'t accept the request method.');
      console.log('This might indicate the endpoint is not properly configured.\n');
      process.exit(1);
    } else {
      logError(`Unexpected response (HTTP ${res.statusCode})\n`);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  logError('Connection failed\n');
  console.log(`Could not connect to ${SITE_URL}/api/revalidate\n`);
  console.log('Possible causes:');
  console.log('  1. Development server is not running (run: npm run dev)');
  console.log('  2. URL is incorrect');
  console.log('  3. Network connectivity issues\n');
  console.log(`Error: ${error.message}\n`);
  process.exit(1);
});

// Send the request
req.write(payloadString);
req.end();
