# Testing Infrastructure

This directory contains the testing infrastructure for the Afrexia website.

## Test Types

### Unit Tests (Vitest)
Unit tests are located alongside the code they test in `__tests__` directories.

**Run unit tests:**
```bash
npm test                 # Watch mode
npm run test:run         # Single run
npm run test:coverage    # With coverage report
npm run test:ui          # Interactive UI
```

**Property-Based Tests:**
Property-based tests use `fast-check` to validate universal properties across many inputs.
```bash
npm run test:pbt         # Run only property-based tests
```

### E2E Tests (Playwright)
End-to-end tests are located in `tests/e2e/`.

**Run E2E tests:**
```bash
npm run test:e2e         # Run all E2E tests
npm run test:e2e:ui      # Interactive UI mode
npm run test:e2e:debug   # Debug mode
```

### Accessibility Tests
Accessibility tests use `jest-axe` (unit) and `@axe-core/playwright` (E2E).

**Run accessibility tests:**
```bash
npm run test:run -- lib/accessibility/__tests__/
npm run test:e2e -- tests/e2e/accessibility.spec.ts
```

## Test Structure

```
tests/
├── e2e/                          # End-to-end tests
│   ├── helpers/                  # E2E test utilities
│   │   ├── accessibility.ts      # Axe-core helpers
│   │   └── navigation.ts         # Navigation helpers
│   ├── buyer-journey.spec.ts     # Buyer user journey
│   ├── institutional-journey.spec.ts
│   ├── language-switching.spec.ts
│   ├── resource-download.spec.ts
│   └── blog-reading.spec.ts
├── helpers/                      # Shared test utilities
│   └── pbt-utils.ts             # Property-based test arbitraries
└── unit/                        # Shared unit test fixtures
```

## Writing Tests

### Unit Tests
```typescript
import { describe, it, expect } from 'vitest';

describe('MyComponent', () => {
  it('should render correctly', () => {
    // Test implementation
  });
});
```

### Property-Based Tests
```typescript
import { describe, it } from 'vitest';
import * as fc from 'fast-check';

describe('Property: My property', () => {
  it('should hold for all valid inputs', () => {
    fc.assert(
      fc.property(fc.string(), (input) => {
        // Property assertion
        return true;
      })
    );
  });
});
```

### E2E Tests
```typescript
import { test, expect } from '@playwright/test';
import { expectNoA11yViolations } from './helpers/accessibility';

test('should navigate to products page', async ({ page }) => {
  await page.goto('/en/products');
  await expect(page).toHaveTitle(/Products/);
  await expectNoA11yViolations(page);
});
```

## Coverage

Coverage reports are generated in the `coverage/` directory.

**View coverage:**
```bash
npm run test:coverage
open coverage/index.html
```

## CI/CD Integration

Tests run automatically in CI/CD pipelines:
- Unit tests run on every commit
- E2E tests run on pull requests
- Coverage reports are uploaded to code coverage services

## Best Practices

1. **Test Naming**: Use descriptive test names that explain what is being tested
2. **Test Isolation**: Each test should be independent and not rely on other tests
3. **Test Data**: Use factories or fixtures for test data
4. **Assertions**: Use specific assertions that provide clear error messages
5. **Accessibility**: Include accessibility checks in E2E tests
6. **Performance**: Keep tests fast by mocking external dependencies
7. **Property Tests**: Use property-based tests for universal correctness properties
8. **Coverage**: Aim for 70%+ code coverage on critical paths

## Troubleshooting

### Tests Failing Locally
1. Ensure all dependencies are installed: `npm install`
2. Clear test cache: `npm run test:run -- --clearCache`
3. Check environment variables in `.env.local`

### E2E Tests Timing Out
1. Increase timeout in `playwright.config.ts`
2. Ensure dev server is running: `npm run dev`
3. Check network connectivity

### Accessibility Violations
1. Review axe-core report for specific violations
2. Fix violations in the component code
3. Re-run tests to verify fixes

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [fast-check Documentation](https://fast-check.dev/)
- [jest-axe Documentation](https://github.com/nickcolley/jest-axe)
- [axe-core Documentation](https://www.deque.com/axe/)
