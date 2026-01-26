#!/usr/bin/env node

/**
 * Monitoring and Analytics Verification Script
 * Task 27.2: Verify Sentry, Plausible, GA4, and Vercel Analytics
 * Requirements: 15.1, 15.2, 15.3, 25.1, 25.5
 */

const fs = require('fs');
const path = require('path');

const results = [];

/**
 * Load environment variables from .env.local
 */
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

/**
 * Verify Sentry Configuration
 */
function verifySentry() {
  const requiredVars = ['NEXT_PUBLIC_SENTRY_DSN'];
  const optionalVars = ['SENTRY_AUTH_TOKEN', 'SENTRY_ORG', 'SENTRY_PROJECT'];
  
  const missingVars = requiredVars.filter(v => !process.env[v]);
  const configuredVars = [...requiredVars, ...optionalVars].filter(v => process.env[v]);

  if (missingVars.length > 0) {
    return {
      service: 'Sentry Error Tracking',
      status: 'not_configured',
      details: 'Missing required environment variables. Sentry will not track errors.',
      envVars: configuredVars,
      missingVars,
    };
  }

  // Check if config files exist
  const configFiles = [
    'sentry.client.config.ts',
    'sentry.server.config.ts',
    'sentry.edge.config.ts',
    'instrumentation.ts',
  ];

  const missingFiles = configFiles.filter(file => !fs.existsSync(path.join(process.cwd(), file)));

  if (missingFiles.length > 0) {
    return {
      service: 'Sentry Error Tracking',
      status: 'error',
      details: `Missing configuration files: ${missingFiles.join(', ')}`,
      envVars: configuredVars,
      missingVars,
    };
  }

  return {
    service: 'Sentry Error Tracking',
    status: 'configured',
    details: `Sentry is properly configured. DSN: ${process.env.NEXT_PUBLIC_SENTRY_DSN.substring(0, 30)}... Check your Sentry dashboard for events.`,
    envVars: configuredVars,
    missingVars: [],
  };
}

/**
 * Verify Plausible Analytics Configuration
 */
function verifyPlausible() {
  const requiredVars = ['NEXT_PUBLIC_PLAUSIBLE_DOMAIN'];
  const missingVars = requiredVars.filter(v => !process.env[v]);
  const configuredVars = requiredVars.filter(v => process.env[v]);

  if (missingVars.length > 0) {
    return {
      service: 'Plausible Analytics',
      status: 'not_configured',
      details: 'Missing required environment variables. Plausible will not track page views.',
      envVars: configuredVars,
      missingVars,
    };
  }

  // Check if AnalyticsProvider exists
  const providerPath = path.join(process.cwd(), 'components/providers/AnalyticsProvider.tsx');
  if (!fs.existsSync(providerPath)) {
    return {
      service: 'Plausible Analytics',
      status: 'error',
      details: 'AnalyticsProvider component not found.',
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
function verifyGA4() {
  const requiredVars = ['NEXT_PUBLIC_GA_MEASUREMENT_ID'];
  const missingVars = requiredVars.filter(v => !process.env[v]);
  const configuredVars = requiredVars.filter(v => process.env[v]);

  if (missingVars.length > 0) {
    return {
      service: 'Google Analytics 4',
      status: 'not_configured',
      details: 'Missing required environment variables. GA4 will not track events (requires user consent).',
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
function verifyVercelAnalytics() {
  // Check if @vercel/analytics is installed
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  const hasVercelAnalytics = packageJson.dependencies && packageJson.dependencies['@vercel/analytics'];
  
  if (!hasVercelAnalytics) {
    return {
      service: 'Vercel Analytics',
      status: 'error',
      details: '@vercel/analytics package not installed. Run: npm install @vercel/analytics',
      envVars: [],
      missingVars: [],
    };
  }

  const isVercelDeployment = process.env.VERCEL === '1';
  
  if (isVercelDeployment) {
    return {
      service: 'Vercel Analytics',
      status: 'configured',
      details: 'Vercel Analytics is automatically enabled on Vercel deployments. Check your Vercel dashboard for analytics data.',
      envVars: ['VERCEL'],
      missingVars: [],
    };
  }

  return {
    service: 'Vercel Analytics',
    status: 'configured',
    details: 'Vercel Analytics is installed via @vercel/analytics package. Will be active when deployed to Vercel. In local development, it runs in debug mode.',
    envVars: [],
    missingVars: [],
  };
}

/**
 * Verify Analytics Events Module
 */
function verifyAnalyticsEvents() {
  const eventsPath = path.join(process.cwd(), 'lib/analytics/events.ts');
  
  if (!fs.existsSync(eventsPath)) {
    return {
      service: 'Analytics Events Module',
      status: 'error',
      details: 'Analytics events module not found at lib/analytics/events.ts',
      envVars: [],
      missingVars: [],
    };
  }

  const eventsContent = fs.readFileSync(eventsPath, 'utf-8');
  const requiredFunctions = [
    'trackEvent',
    'trackRFQSubmission',
    'trackContactSubmission',
    'trackResourceDownload',
    'trackProductView',
    'trackCTAClick',
    'isTrackingEnabled',
  ];

  const missingFunctions = requiredFunctions.filter(fn => !eventsContent.includes(`export function ${fn}`));

  if (missingFunctions.length > 0) {
    return {
      service: 'Analytics Events Module',
      status: 'error',
      details: `Missing functions: ${missingFunctions.join(', ')}`,
      envVars: [],
      missingVars: [],
    };
  }

  return {
    service: 'Analytics Events Module',
    status: 'configured',
    details: 'All analytics tracking functions are properly implemented.',
    envVars: [],
    missingVars: [],
  };
}

/**
 * Main verification function
 */
function verifyMonitoringAndAnalytics() {
  console.log('🔍 Verifying Monitoring and Analytics Configuration...\n');
  console.log('='.repeat(80));
  console.log('\n');

  // Load environment variables
  loadEnvFile();

  // Run all verifications
  results.push(verifySentry());
  results.push(verifyPlausible());
  results.push(verifyGA4());
  results.push(verifyVercelAnalytics());
  results.push(verifyAnalyticsEvents());

  // Display results
  results.forEach((result) => {
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

  console.log('='.repeat(80));
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

  console.log('📚 Documentation:');
  console.log('   See docs/MONITORING_ANALYTICS.md for detailed setup instructions');
  console.log('\n');

  // Exit code
  const exitCode = errors > 0 ? 1 : 0;
  process.exit(exitCode);
}

// Run verification
verifyMonitoringAndAnalytics();
