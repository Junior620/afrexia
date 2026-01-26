#!/usr/bin/env node

/**
 * Vercel KV Connection Test Script
 * 
 * This script tests the Vercel KV connection and rate limiting functionality.
 * Run this script to verify that KV is properly configured.
 * 
 * Usage:
 *   npm run test:kv
 */

import { kv } from '@vercel/kv';

const results = [];

/**
 * Test 1: Basic KV Connection
 */
async function testConnection() {
  const startTime = Date.now();
  try {
    // Try to ping the KV database
    const response = await kv.ping();
    const duration = Date.now() - startTime;
    
    if (response === 'PONG') {
      return {
        test: 'KV Connection',
        status: 'PASS',
        message: 'Successfully connected to Vercel KV',
        duration,
      };
    } else {
      return {
        test: 'KV Connection',
        status: 'FAIL',
        message: `Unexpected response: ${response}`,
        duration,
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      test: 'KV Connection',
      status: 'FAIL',
      message: `Connection failed: ${error.message}`,
      duration,
    };
  }
}

/**
 * Test 2: Set and Get Operations
 */
async function testSetGet() {
  const startTime = Date.now();
  const testKey = 'test:connection:timestamp';
  const testValue = Date.now().toString();
  
  try {
    // Set a value
    await kv.set(testKey, testValue);
    
    // Get the value back
    const retrievedValue = await kv.get(testKey);
    
    // Clean up
    await kv.del(testKey);
    
    const duration = Date.now() - startTime;
    
    if (retrievedValue === testValue) {
      return {
        test: 'Set/Get Operations',
        status: 'PASS',
        message: 'Successfully set and retrieved value',
        duration,
      };
    } else {
      return {
        test: 'Set/Get Operations',
        status: 'FAIL',
        message: `Value mismatch: expected ${testValue}, got ${retrievedValue}`,
        duration,
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      test: 'Set/Get Operations',
      status: 'FAIL',
      message: `Operation failed: ${error.message}`,
      duration,
    };
  }
}

/**
 * Test 3: Increment and Expiry (Rate Limiting Simulation)
 */
async function testRateLimiting() {
  const startTime = Date.now();
  const testKey = 'test:rate_limit:127.0.0.1';
  const maxRequests = 5;
  const windowSeconds = 60;
  
  try {
    // Clean up any existing test key
    await kv.del(testKey);
    
    // Simulate rate limiting
    const counts = [];
    
    for (let i = 0; i < maxRequests + 2; i++) {
      const count = await kv.incr(testKey);
      counts.push(count);
      
      // Set expiry on first request
      if (count === 1) {
        await kv.expire(testKey, windowSeconds);
      }
    }
    
    // Clean up
    await kv.del(testKey);
    
    const duration = Date.now() - startTime;
    
    // Verify counts are sequential
    const expectedCounts = Array.from({ length: maxRequests + 2 }, (_, i) => i + 1);
    const countsMatch = counts.every((count, index) => count === expectedCounts[index]);
    
    if (countsMatch) {
      return {
        test: 'Rate Limiting (INCR/EXPIRE)',
        status: 'PASS',
        message: `Successfully simulated rate limiting: ${counts.join(', ')}`,
        duration,
      };
    } else {
      return {
        test: 'Rate Limiting (INCR/EXPIRE)',
        status: 'FAIL',
        message: `Count sequence incorrect: expected ${expectedCounts.join(', ')}, got ${counts.join(', ')}`,
        duration,
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      test: 'Rate Limiting (INCR/EXPIRE)',
      status: 'FAIL',
      message: `Operation failed: ${error.message}`,
      duration,
    };
  }
}

/**
 * Test 4: TTL (Time To Live) Verification
 */
async function testTTL() {
  const startTime = Date.now();
  const testKey = 'test:ttl:verification';
  const ttlSeconds = 5;
  
  try {
    // Set a value with TTL
    await kv.set(testKey, 'test-value', { ex: ttlSeconds });
    
    // Check TTL
    const ttl = await kv.ttl(testKey);
    
    // Clean up
    await kv.del(testKey);
    
    const duration = Date.now() - startTime;
    
    if (ttl > 0 && ttl <= ttlSeconds) {
      return {
        test: 'TTL (Time To Live)',
        status: 'PASS',
        message: `TTL correctly set: ${ttl} seconds remaining`,
        duration,
      };
    } else {
      return {
        test: 'TTL (Time To Live)',
        status: 'FAIL',
        message: `TTL incorrect: expected 0 < ttl <= ${ttlSeconds}, got ${ttl}`,
        duration,
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      test: 'TTL (Time To Live)',
      status: 'FAIL',
      message: `Operation failed: ${error.message}`,
      duration,
    };
  }
}

/**
 * Test 5: Environment Variables Check
 */
function testEnvironmentVariables() {
  const requiredVars = [
    'KV_URL',
    'KV_REST_API_URL',
    'KV_REST_API_TOKEN',
    'KV_REST_API_READ_ONLY_TOKEN',
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length === 0) {
    return {
      test: 'Environment Variables',
      status: 'PASS',
      message: 'All required KV environment variables are set',
    };
  } else {
    return {
      test: 'Environment Variables',
      status: 'FAIL',
      message: `Missing environment variables: ${missingVars.join(', ')}`,
    };
  }
}

/**
 * Print test results
 */
function printResults(results) {
  console.log('\n' + '='.repeat(80));
  console.log('VERCEL KV CONNECTION TEST RESULTS');
  console.log('='.repeat(80) + '\n');
  
  results.forEach((result, index) => {
    const statusIcon = result.status === 'PASS' ? '✓' : '✗';
    const statusColor = result.status === 'PASS' ? '\x1b[32m' : '\x1b[31m';
    const resetColor = '\x1b[0m';
    
    console.log(`${index + 1}. ${result.test}`);
    console.log(`   ${statusColor}${statusIcon} ${result.status}${resetColor}: ${result.message}`);
    if (result.duration) {
      console.log(`   Duration: ${result.duration}ms`);
    }
    console.log('');
  });
  
  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  
  console.log('='.repeat(80));
  console.log(`SUMMARY: ${passCount} passed, ${failCount} failed`);
  console.log('='.repeat(80) + '\n');
  
  if (failCount > 0) {
    console.log('\x1b[31m❌ Some tests failed. Please check the configuration.\x1b[0m\n');
    console.log('Troubleshooting steps:');
    console.log('1. Verify Vercel KV database is created in Vercel dashboard');
    console.log('2. Run: vercel env pull .env.local');
    console.log('3. Restart your development server');
    console.log('4. Check docs/VERCEL_KV_SETUP.md for detailed setup instructions\n');
    process.exit(1);
  } else {
    console.log('\x1b[32m✓ All tests passed! Vercel KV is properly configured.\x1b[0m\n');
    process.exit(0);
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('\nStarting Vercel KV connection tests...\n');
  
  // Test 1: Environment Variables (synchronous)
  results.push(testEnvironmentVariables());
  
  // If environment variables are missing, skip other tests
  if (results[0].status === 'FAIL') {
    printResults(results);
    return;
  }
  
  // Test 2: Connection
  results.push(await testConnection());
  
  // Test 3: Set/Get
  results.push(await testSetGet());
  
  // Test 4: Rate Limiting
  results.push(await testRateLimiting());
  
  // Test 5: TTL
  results.push(await testTTL());
  
  // Print results
  printResults(results);
}

// Run tests
runTests().catch((error) => {
  console.error('\n\x1b[31mUnexpected error during tests:\x1b[0m');
  console.error(error);
  process.exit(1);
});
