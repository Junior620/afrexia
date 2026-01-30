#!/usr/bin/env node

/**
 * Lighthouse Performance Testing Script
 * 
 * Task 22.5: Verify Lighthouse scores (≥85 desktop, ≥75 mobile)
 * Requirements: 9.7, 9.8
 * 
 * This script runs Lighthouse audits on the product catalog page
 * and verifies that performance scores meet the required thresholds.
 * 
 * Usage:
 *   node scripts/lighthouse-performance.js [url]
 * 
 * Example:
 *   node scripts/lighthouse-performance.js http://localhost:3000/en/products
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Configuration
const TARGET_URL = process.argv[2] || 'http://localhost:3000/en/products';
const MIN_DESKTOP_SCORE = 85;
const MIN_MOBILE_SCORE = 75;

// Lighthouse configurations
const desktopConfig = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
      requestLatencyMs: 0,
      downloadThroughputKbps: 0,
      uploadThroughputKbps: 0,
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4695.0 Safari/537.36 Chrome-Lighthouse',
  },
};

const mobileConfig = {
  extends: 'lighthouse:default',
  settings: {
    formFactor: 'mobile',
    throttling: {
      rttMs: 150,
      throughputKbps: 1.6 * 1024,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 150,
      downloadThroughputKbps: 1.6 * 1024,
      uploadThroughputKbps: 750,
    },
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false,
    },
  },
};

async function launchChromeAndRunLighthouse(url, config, formFactor) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
  };

  try {
    const runnerResult = await lighthouse(url, options, config);
    await chrome.kill();
    return runnerResult;
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

function analyzeResults(results, formFactor, minScore) {
  const { lhr } = results;
  const performanceScore = lhr.categories.performance.score * 100;
  
  console.log(`\n=== ${formFactor.toUpperCase()} PERFORMANCE RESULTS ===`);
  console.log(`URL: ${lhr.finalUrl}`);
  console.log(`Performance Score: ${performanceScore.toFixed(1)}/100`);
  console.log(`Required Score: ${minScore}/100`);
  console.log(`Status: ${performanceScore >= minScore ? '✓ PASS' : '✗ FAIL'}`);

  // Key metrics
  const metrics = lhr.audits;
  console.log('\nKey Metrics:');
  console.log(`  First Contentful Paint: ${metrics['first-contentful-paint'].displayValue}`);
  console.log(`  Largest Contentful Paint: ${metrics['largest-contentful-paint'].displayValue}`);
  console.log(`  Total Blocking Time: ${metrics['total-blocking-time'].displayValue}`);
  console.log(`  Cumulative Layout Shift: ${metrics['cumulative-layout-shift'].displayValue}`);
  console.log(`  Speed Index: ${metrics['speed-index'].displayValue}`);

  // Opportunities for improvement
  const opportunities = Object.values(metrics)
    .filter(audit => audit.details && audit.details.type === 'opportunity')
    .filter(audit => audit.score !== null && audit.score < 1)
    .sort((a, b) => (b.details.overallSavingsMs || 0) - (a.details.overallSavingsMs || 0))
    .slice(0, 5);

  if (opportunities.length > 0) {
    console.log('\nTop Opportunities for Improvement:');
    opportunities.forEach((audit, index) => {
      const savings = audit.details.overallSavingsMs || 0;
      console.log(`  ${index + 1}. ${audit.title}: ${(savings / 1000).toFixed(2)}s potential savings`);
    });
  }

  return {
    formFactor,
    score: performanceScore,
    passed: performanceScore >= minScore,
    metrics: {
      fcp: metrics['first-contentful-paint'].numericValue,
      lcp: metrics['largest-contentful-paint'].numericValue,
      tbt: metrics['total-blocking-time'].numericValue,
      cls: metrics['cumulative-layout-shift'].numericValue,
      si: metrics['speed-index'].numericValue,
    },
  };
}

async function runPerformanceTests() {
  console.log('=== LIGHTHOUSE PERFORMANCE TESTING ===');
  console.log(`Target URL: ${TARGET_URL}`);
  console.log(`Desktop Threshold: ${MIN_DESKTOP_SCORE}/100`);
  console.log(`Mobile Threshold: ${MIN_MOBILE_SCORE}/100`);
  console.log('\nStarting tests...\n');

  try {
    // Run desktop test
    console.log('Running desktop audit...');
    const desktopResults = await launchChromeAndRunLighthouse(
      TARGET_URL,
      desktopConfig,
      'desktop'
    );
    const desktopAnalysis = analyzeResults(desktopResults, 'desktop', MIN_DESKTOP_SCORE);

    // Run mobile test
    console.log('\nRunning mobile audit...');
    const mobileResults = await launchChromeAndRunLighthouse(
      TARGET_URL,
      mobileConfig,
      'mobile'
    );
    const mobileAnalysis = analyzeResults(mobileResults, 'mobile', MIN_MOBILE_SCORE);

    // Summary
    console.log('\n=== PERFORMANCE TEST SUMMARY ===');
    console.log(`Desktop: ${desktopAnalysis.score.toFixed(1)}/100 (${desktopAnalysis.passed ? '✓ PASS' : '✗ FAIL'})`);
    console.log(`Mobile: ${mobileAnalysis.score.toFixed(1)}/100 (${mobileAnalysis.passed ? '✓ PASS' : '✗ FAIL'})`);

    const allPassed = desktopAnalysis.passed && mobileAnalysis.passed;
    console.log(`\nOverall: ${allPassed ? '✓ ALL TESTS PASSED' : '✗ SOME TESTS FAILED'}`);

    // Save results to file
    const reportDir = path.join(process.cwd(), '.kiro', 'specs', 'product-catalog-redesign');
    const reportPath = path.join(reportDir, 'lighthouse-performance-report.json');
    
    const report = {
      timestamp: new Date().toISOString(),
      url: TARGET_URL,
      desktop: desktopAnalysis,
      mobile: mobileAnalysis,
      passed: allPassed,
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\nReport saved to: ${reportPath}`);

    // Exit with appropriate code
    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error('\n✗ Error running Lighthouse tests:', error.message);
    console.error('\nMake sure:');
    console.error('  1. The development server is running');
    console.error('  2. The URL is accessible');
    console.error('  3. Chrome is installed');
    console.error('  4. lighthouse and chrome-launcher packages are installed');
    process.exit(1);
  }
}

// Check if required packages are installed
try {
  require.resolve('lighthouse');
  require.resolve('chrome-launcher');
} catch (error) {
  console.error('✗ Required packages not found.');
  console.error('\nPlease install them with:');
  console.error('  npm install --save-dev lighthouse chrome-launcher');
  process.exit(1);
}

// Run the tests
runPerformanceTests();
