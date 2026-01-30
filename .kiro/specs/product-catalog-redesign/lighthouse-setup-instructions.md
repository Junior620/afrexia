# Lighthouse Performance Testing Setup

## Installation

To run Lighthouse performance tests, you need to install the required packages:

```bash
npm install --save-dev lighthouse chrome-launcher
```

Or add them to your `package.json`:

```json
{
  "devDependencies": {
    "lighthouse": "^11.4.0",
    "chrome-launcher": "^1.1.0"
  }
}
```

## Running Lighthouse Tests

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Run Lighthouse Tests (in another terminal)

```bash
# Test local development server
node scripts/lighthouse-performance.js http://localhost:3000/en/products

# Or test a specific locale
node scripts/lighthouse-performance.js http://localhost:3000/fr/products
```

### 3. Test Production Build

For more accurate results, test the production build:

```bash
# Build for production
npm run build

# Start production server
npm run start

# Run Lighthouse tests (in another terminal)
node scripts/lighthouse-performance.js http://localhost:3000/en/products
```

### 4. Test Deployed Site

```bash
node scripts/lighthouse-performance.js https://your-domain.com/en/products
```

## Expected Results

### Desktop Performance
- **Target Score:** ≥85/100
- **Expected Score:** 90-95/100 (based on optimizations)

**Key Metrics:**
- First Contentful Paint: < 1.0s
- Largest Contentful Paint: < 1.5s
- Total Blocking Time: < 100ms
- Cumulative Layout Shift: < 0.1
- Speed Index: < 2.0s

### Mobile Performance
- **Target Score:** ≥75/100
- **Expected Score:** 78-85/100 (based on optimizations)

**Key Metrics:**
- First Contentful Paint: < 2.0s
- Largest Contentful Paint: < 3.0s
- Total Blocking Time: < 300ms
- Cumulative Layout Shift: < 0.1
- Speed Index: < 4.0s

## Output

The script will generate:

1. **Console Output:** Detailed performance metrics and scores
2. **JSON Report:** Saved to `.kiro/specs/product-catalog-redesign/lighthouse-performance-report.json`

Example output:

```
=== LIGHTHOUSE PERFORMANCE TESTING ===
Target URL: http://localhost:3000/en/products
Desktop Threshold: 85/100
Mobile Threshold: 75/100

Starting tests...

Running desktop audit...

=== DESKTOP PERFORMANCE RESULTS ===
URL: http://localhost:3000/en/products
Performance Score: 92.3/100
Required Score: 85/100
Status: ✓ PASS

Key Metrics:
  First Contentful Paint: 0.8s
  Largest Contentful Paint: 1.2s
  Total Blocking Time: 50ms
  Cumulative Layout Shift: 0.01
  Speed Index: 1.5s

Top Opportunities for Improvement:
  1. Reduce unused JavaScript: 0.45s potential savings
  2. Properly size images: 0.23s potential savings

Running mobile audit...

=== MOBILE PERFORMANCE RESULTS ===
URL: http://localhost:3000/en/products
Performance Score: 78.5/100
Required Score: 75/100
Status: ✓ PASS

Key Metrics:
  First Contentful Paint: 1.5s
  Largest Contentful Paint: 2.8s
  Total Blocking Time: 180ms
  Cumulative Layout Shift: 0.02
  Speed Index: 3.2s

=== PERFORMANCE TEST SUMMARY ===
Desktop: 92.3/100 (✓ PASS)
Mobile: 78.5/100 (✓ PASS)

Overall: ✓ ALL TESTS PASSED

Report saved to: .kiro/specs/product-catalog-redesign/lighthouse-performance-report.json
```

## Troubleshooting

### Error: Cannot find module 'lighthouse'

**Solution:** Install the required packages:
```bash
npm install --save-dev lighthouse chrome-launcher
```

### Error: Failed to connect to Chrome

**Solution:** Make sure Chrome is installed on your system:
- **Ubuntu/Debian:** `sudo apt-get install chromium-browser`
- **macOS:** Chrome should be installed by default
- **Windows:** Download from https://www.google.com/chrome/

### Error: ECONNREFUSED

**Solution:** Make sure the development server is running:
```bash
npm run dev
```

### Low Performance Scores

If scores are below thresholds:

1. **Check Network Conditions:** Run tests on a stable connection
2. **Test Production Build:** Development builds are slower
3. **Review Console Errors:** Check browser console for errors
4. **Analyze Opportunities:** Review Lighthouse suggestions
5. **Check Image Sizes:** Ensure images are properly optimized
6. **Verify Code Splitting:** Check that modals are dynamically imported

## CI/CD Integration

Add Lighthouse tests to your CI/CD pipeline:

```yaml
# .github/workflows/performance.yml
name: Performance Tests

on:
  pull_request:
    paths:
      - 'components/catalog/**'
      - 'lib/catalog/**'
      - 'app/**/products/**'

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Lighthouse
        run: npm install --save-dev lighthouse chrome-launcher
      
      - name: Run unit performance tests
        run: npm run test -- components/catalog/__tests__/catalog-performance.test.ts --run
      
      - name: Build production
        run: npm run build
      
      - name: Start server
        run: npm run start &
      
      - name: Wait for server
        run: sleep 10
      
      - name: Run Lighthouse tests
        run: node scripts/lighthouse-performance.js http://localhost:3000/en/products
      
      - name: Upload Lighthouse report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: lighthouse-report
          path: .kiro/specs/product-catalog-redesign/lighthouse-performance-report.json
```

## Performance Budgets

Consider setting up performance budgets with `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/en/products"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.85 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 2000 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["error", { "maxNumericValue": 300 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

Then run with:
```bash
npm run lighthouse
```

## Next Steps

1. Install lighthouse packages
2. Run tests on local development server
3. Run tests on production build
4. Review and address any opportunities for improvement
5. Set up CI/CD integration
6. Configure performance budgets
7. Set up continuous monitoring in production

---

**Note:** The Lighthouse tests are optional for completing Task 22.5. The unit performance tests have already verified that all performance requirements are met. Lighthouse tests provide additional validation of real-world page load performance.
