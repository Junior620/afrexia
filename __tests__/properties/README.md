# Property-Based Tests

This directory contains property-based tests using fast-check to validate the correctness properties of the SEO programmatic system.

## Test Organization

Tests are organized by component:

- `routeCombinationValidator.properties.test.ts` - Properties 2, 3
- `contentGenerator.properties.test.ts` - Properties 1, 12, 14, 16
- `indexabilityController.properties.test.ts` - Properties 19, 25
- `metadataGenerator.properties.test.ts` - Properties 6, 29, 30, 31, 32
- `sitemapGenerator.properties.test.ts` - Properties 17, 26, 27, 28
- `internalLinkingEngine.properties.test.ts` - Properties 33, 34, 35
- `routes.properties.test.ts` - Properties 4, 5, 15, 18, 36, 37, 38, 39, 40, 41
- `dataFreshness.properties.test.ts` - Properties 20, 21

## Running Tests

```bash
# Run all property-based tests
npm test -- __tests__/properties

# Run specific test file
npm test -- __tests__/properties/contentGenerator.properties.test.ts

# Run with coverage
npm test -- --coverage __tests__/properties
```

## Property-Based Testing Principles

Each test validates a correctness property that must hold for all valid inputs:

1. Generate random test data using fast-check arbitraries
2. Run the property check with minimum 100 runs
3. Verify the property holds for all generated inputs
4. Document which requirements each property validates

## Example Property Test

```typescript
import fc from 'fast-check';

it('Property: All pages with >30% fallback are marked noindex', () => {
  fc.assert(
    fc.property(
      fc.record({
        fallbackPercentage: fc.integer({ min: 31, max: 100 }),
        // ... other fields
      }),
      (pageData) => {
        const decision = determineIndexability(pageData);
        expect(decision.isIndexable).toBe(false);
      }
    ),
    { numRuns: 100 }
  );
});
```
