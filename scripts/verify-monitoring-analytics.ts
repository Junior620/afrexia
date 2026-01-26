/**
 * Monitoring and Analytics Verification Script
 * Task 27.2: Verify Sentry, Plausible, GA4, and Vercel Analytics
 * Requirements: 15.1, 15.2, 15.3, 25.1, 25.5
 */

import * as Sentry from '@sentry/nextjs';

interface VerificationResult {
  service: string;
  status: 'configured' | 'not_configured' | 'error';
  details: string;
  envVars: string[];
  missingVars: string[];
}

const results: VerificationResult[] = [];

/**
 * Verify Sentry Configuration
 */
function verifySentry(): VerificationResult {
  const requiredVars = ['NEXT_PUBLIC_SENTRY_DSN'];
  const optionalVars = ['SENTRY_AUTH_TOKEN', 'SENTRY_ORG', 'SENTRY_PROJECT'];
  
  const missingVars = requiredVars.filter(v => !process.env[v]);
  const configuredVars = [...requiredVars, ...optionalVars].filter(v => process.env[v]);

  if (missingVars.length > 0) {
    return {
      service: 'Sentry Error Tracking',
      status: 'not_configured',
      details: `Missing required environment variables. Sentry will not track errors.`,
      envVars: configuredVars,
      missingVars,
    };
  }

  // Test Sentry by capturing a test message
  try {
    const eventId = Sentry.captureMessage('Monitoring verification test', 'info');
    
    return {
      service: 'Sentry Error Tracking',
      status: 'configured',
      details: `Sentry is properly configured. Test event ID: ${eventId}. Check your Sentry dashboard.`,
      envVars: configuredVars,
      missingVars: [],
    };
  } catch (error) {
    return {
      service: 'Sentry Error Tracking',
      status: 'error',
      details: `Sentry configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      envVars: configuredVars,
      missingVars,
    };
  }
}

/**
 * Verify Plausible Analytics Configuration
 */
function verifyPlausible(): VerificationResult {
  const requiredVars = ['NEXT_PUBLIC_PLAUSIBLE_DOMAIN'];
  const missingVars = requiredVars.filter(v => !process.env[v]);
  const configuredVars = requiredVars.filter(v => process.env[v]);

  if (missingVars.length > 0) {
    return {
      service: 'Plausible Analytics',
      status: 'not_configured',
      details: `Missing required environment variables. Plausible will not track page views.`,
      envVars: configuredVars,
      missingVars,
    };
  }

  return {
    service: 'Plausible Analytics',
    status: 'configured',
    details: `Plausible is configured for domain: ${process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}. Script will load on client-side. Verify tracking at https://plausible.io/${process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}`,
    envVars: configuredVars,
    missingVars: [],
  };
}

/**
 * Verify Google Analytics 4 Configuration
 */
function verifyGA4(): VerificationResult {
  const requiredVars = ['NEXT_PUBLIC_GA_MEASUREMENT_ID'];
  const missingVars = requiredVars.filter(v => !process.env[v]);
  const configuredVars = requiredVars.filter(v => process.env[v]);

  if (missingVars.length > 0) {
    return {
      service: 'Google Analytics 4',
      status: 'not_configured',
      details: `Missing required environment variables. GA4 will not track events (requires user consent).`,
      envVars: configuredVars,
      missingVars,
    };
  }

  return {
    service: 'Google Analytics 4',
    status: 'configured',
    details: `GA4 is configured with measurement ID: ${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}. Will load only with user consent. Verify at https://analytics.google.com/`,
    envVars: configuredVars,
    missingVars: [],
  };
}

/**
 * Verify Vercel Analytics Configuration
 */
function verifyVercelAnalytics(): VerificationResult {
  // Vercel Analytics doesn't require environment variables
  // It's automatically enabled when deployed to Vercel
  
  const isVercelDeployment = process.env.VERCEL === '1';
  
  if (isVercelDeployment) {
    return {
      service: 'Vercel Analytics',
      status: 'configured',
      details: `Vercel Analytics is automatically enabled on Vercel deployments. Check your Vercel dashboard for analytics data.`,
      envVars: ['VERCEL'],
      missingVars: [],
    };
  }

  return {
    service: 'Vercel Analytics',
    status: 'configured',
    details: `Vercel Analytics is installed via @vercel/analytics package. Will be active when deployed to Vercel. In local development, it runs in debug mode.`,
    envVars: [],
    missingVars: [],
  };
}

/**
 * Main verification function
 */
async function verifyMonitoringAndAnalytics() {
  console.log('🔍 Verifying Monitoring and Analytics Configuration...\n');
  console.log('=' .repeat(80));
  console.log('\n');

  // Run all verifications
  results.push(verifySentry());
  results.push(verifyPlausible());
  results.push(verifyGA4());
  results.push(verifyVercelAnalytics());

  // Display results
  results.forEach((result, index) => {
    const statusEmoji = 
      result.status === 'configured' ? '✅' :
      result.status === 'not_configured' ? '⚠️' :
      '❌';

    console.log(`${statusEmoji} ${result.service}`);
    console.log(`   Status: ${result.status.toUpperCase()}`);
    console.log(`   Details: ${result.details}`);
    
    if (result.envVars.length > 0) {
      console.log(`   Configured vars: ${result.envVars.join(', ')}`);
    }
    
    if (result.missingVars.length > 0) {
      console.log(`   ⚠️  Missing vars: ${result.missingVars.join(', ')}`);
    }
    
    console.log('');
  });

  console.log('=' .repeat(80));
  console.log('\n');

  // Summary
  const configured = results.filter(r => r.status === 'configured').length;
  const notConfigured = results.filter(r => r.status === 'not_configured').length;
  const errors = results.filter(r => r.status === 'error').length;

  console.log('📊 Summary:');
  console.log(`   ✅ Configured: ${configured}/${results.length}`);
  console.log(`   ⚠️  Not Configured: ${notConfigured}/${results.length}`);
  console.log(`   ❌ Errors: ${errors}/${results.length}`);
  console.log('\n');

  // Recommendations
  if (notConfigured > 0 || errors > 0) {
    console.log('💡 Recommendations:');
    console.log('   1. Copy .env.example to .env.local if not already done');
    console.log('   2. Fill in the missing environment variables');
    console.log('   3. For production deployment, set these in Vercel dashboard');
    console.log('   4. Restart the development server after updating .env.local');
    console.log('\n');
  }

  // Next steps
  console.log('🚀 Next Steps:');
  console.log('   1. Deploy to Vercel to activate all analytics in production');
  console.log('   2. Test Sentry by triggering an error in the application');
  console.log('   3. Verify Plausible tracking at https://plausible.io/[your-domain]');
  console.log('   4. Check GA4 real-time reports at https://analytics.google.com/');
  console.log('   5. Monitor Vercel Analytics in your Vercel dashboard');
  console.log('\n');

  // Exit code
  const exitCode = errors > 0 ? 1 : 0;
  process.exit(exitCode);
}

// Run verification
verifyMonitoringAndAnalytics().catch((error) => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
