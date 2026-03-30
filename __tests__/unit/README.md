# Unit Tests

This directory contains traditional unit tests for the SEO programmatic system components.

## Test Organization

Tests are organized to mirror the source code structure:

- `lib/seo/routeCombinationValidator.test.ts`
- `lib/seo/contentGenerator.test.ts`
- `lib/seo/metadataGenerator.test.ts`
- `lib/seo/sitemapGenerator.test.ts`
- `lib/seo/indexabilityController.test.ts`
- `lib/seo/internalLinkingEngine.test.ts`

## Running Tests

```bash
# Run all unit tests
npm test -- __tests__/unit

# Run specific test file
npm test -- __tests__/unit/lib/seo/contentGenerator.test.ts

# Run with coverage
npm test -- --coverage __tests__/unit
```

## Testing Guidelines

1. **Isolation**: Each unit test should test a single function or method in isolation
2. **Mocking**: Use mocks for external dependencies (Sanity queries, etc.)
3. **Coverage**: Aim for 80%+ code coverage
4. **Clarity**: Test names should clearly describe what is being tested
5. **Arrange-Act-Assert**: Follow the AAA pattern for test structure

## Example Unit Test

```typescript
import { validateProductCountry } from '@/lib/seo/routeCombinationValidator';

describe('validateProductCountry', () => {
  it('should return valid for approved combination with sufficient data', () => {
    const result = validateProductCountry({
      approvedForSEO: true,
      dataCompleteness: 80,
    });
    
    expect(result.isValid).toBe(true);
  });

  it('should return invalid for unapproved combination', () => {
    const result = validateProductCountry({
      approvedForSEO: false,
      dataCompleteness: 80,
    });
    
    expect(result.isValid).toBe(false);
    expect(result.reason).toContain('not approved');
  });
});
```
