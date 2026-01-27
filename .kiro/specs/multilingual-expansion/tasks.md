# Implementation Plan: Multilingual Expansion

## Overview

This implementation plan breaks down the multilingual expansion feature into discrete, incremental coding steps. Each task builds on previous work, with testing integrated throughout to catch errors early. The plan follows this sequence:

1. Update type system and configuration
2. Add translation content for three new languages
3. Enhance language switcher UI component
4. Update middleware for five-locale support
5. Add SEO metadata and hreflang tags
6. Implement comprehensive testing
7. Final integration and validation

## Tasks

- [x] 1. Update type system for five locales
  - [x] 1.1 Update Locale type definition in types/index.ts
    - Modify `Locale` type to include 'es', 'de', 'ru'
    - Update `MultilingualString` interface to include es, de, ru properties
    - Update `MultilingualText` interface to include es, de, ru properties
    - _Requirements: 1.6, 5.1, 5.2, 5.3_
  
  - [x] 1.2 Verify TypeScript compilation with new types
    - Run `tsc --noEmit` to verify no type errors
    - _Requirements: 5.5_

- [x] 2. Update locale configuration
  - [x] 2.1 Expand locales array in lib/i18n/config.ts
    - Add 'es', 'de', 'ru' to locales array
    - Add Spanish, German, Russian to localeNames object
    - Add flag emojis for es (🇪🇸), de (🇩🇪), ru (🇷🇺) to localeFlags object
    - Remove getAlternateLocale() function (no longer applicable)
    - _Requirements: 1.1, 1.3, 1.4_
  
  - [x] 2.2 Write unit tests for locale configuration
    - Test locales array contains all five locales
    - Test default locale is 'fr'
    - Test localeNames has entries for all five locales
    - Test localeFlags has entries for all five locales
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 2.3 Write property test for locale validation
    - **Property 2: Locale Validation Correctness**
    - **Validates: Requirements 1.5**


- [x] 3. Add Spanish translations
  - [x] 3.1 Create Spanish translation object in lib/i18n/translations.ts
    - Add complete 'es' object with all translation keys
    - Include navigation, common, products, footer sections
    - Use formal Spanish (usted form) for business context
    - Preserve {{variable}} placeholders in translations
    - _Requirements: 2.1, 2.6, 2.7_
  
  - [x] 3.2 Write unit tests for Spanish translations
    - Test Spanish translations exist for key paths
    - Test variable interpolation works in Spanish
    - _Requirements: 2.1, 2.4, 2.7_

- [x] 4. Add German translations
  - [x] 4.1 Create German translation object in lib/i18n/translations.ts
    - Add complete 'de' object with all translation keys
    - Include navigation, common, products, footer sections
    - Use formal German (Sie form) for business context
    - Handle German special characters (ü, ö, ä, ß) correctly
    - Preserve {{variable}} placeholders in translations
    - _Requirements: 2.2, 2.6, 2.7_
  
  - [x] 4.2 Write unit tests for German translations
    - Test German translations exist for key paths
    - Test special characters render correctly
    - Test variable interpolation works in German
    - _Requirements: 2.2, 2.4, 2.7, 7.4_

- [x] 5. Add Russian translations
  - [x] 5.1 Create Russian translation object in lib/i18n/translations.ts
    - Add complete 'ru' object with all translation keys
    - Include navigation, common, products, footer sections
    - Use formal Russian (Вы form) for respectful address
    - Handle Cyrillic characters correctly
    - Preserve {{variable}} placeholders in translations
    - _Requirements: 2.3, 2.6, 2.7_
  
  - [x] 5.2 Write unit tests for Russian translations
    - Test Russian translations exist for key paths
    - Test Cyrillic characters render correctly
    - Test variable interpolation works in Russian
    - _Requirements: 2.3, 2.4, 2.7, 7.4_
  
  - [x] 5.3 Write property test for translation completeness
    - **Property 3: Translation Key Completeness**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.5, 2.6, 7.1**
  
  - [x] 5.4 Write property test for translation retrieval
    - **Property 4: Translation Retrieval Correctness**
    - **Validates: Requirements 2.4, 7.2**
  
  - [x] 5.5 Write property test for variable interpolation
    - **Property 5: Variable Interpolation Preservation**
    - **Validates: Requirements 2.7, 7.5**

- [x] 6. Checkpoint - Verify translations and types
  - Ensure all tests pass, verify TypeScript compilation succeeds, ask the user if questions arise.


- [x] 7. Redesign language switcher component
  - [x] 7.1 Implement dropdown language switcher in components/layout/LanguageSwitcher.tsx
    - Replace toggle button with dropdown menu
    - Display all five languages with flags and native names
    - Show current language with checkmark indicator
    - Implement click-outside-to-close functionality
    - Implement Escape key to close dropdown
    - Add proper ARIA attributes (aria-expanded, aria-haspopup, role="menu")
    - Preserve current page path when switching languages
    - Set NEXT_LOCALE cookie on language selection
    - Support dark mode styling
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_
  
  - [x] 7.2 Write unit tests for language switcher
    - Test dropdown renders all five languages
    - Test current language is highlighted with checkmark
    - Test clicking outside closes dropdown
    - Test Escape key closes dropdown
    - Test language names are in native form
    - Test flags are displayed for each language
    - _Requirements: 3.1, 3.5, 3.6, 3.7_
  
  - [x] 7.3 Write property test for path preservation
    - **Property 6: Language Switcher Path Preservation**
    - **Validates: Requirements 3.3, 3.8**
  
  - [x] 7.4 Write property test for cookie persistence
    - **Property 7: Language Switcher Cookie Persistence**
    - **Validates: Requirements 3.4**

- [x] 8. Update middleware for five locales
  - [x] 8.1 Expand middleware locale handling in middleware.ts
    - Add 'es', 'de', 'ru' to locales array
    - Add language code mapping for Spanish, German, Russian variants (es-ES, es-MX, de-DE, de-AT, ru-RU)
    - Update getLocaleFromAcceptLanguage to handle new locales
    - Ensure locale detection priority: cookie → Accept-Language → default
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_
  
  - [x] 8.2 Write unit tests for middleware
    - Test URL with /es/, /de/, /ru/ prefixes are recognized
    - Test redirect from non-localized URL to localized URL
    - Test cookie takes precedence over Accept-Language
    - Test Accept-Language parsing for Spanish, German, Russian
    - Test cookie is set when URL contains locale prefix
    - Test default locale is 'fr' when no preference exists
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  
  - [x] 8.3 Write property test for locale detection priority
    - **Property 8: Middleware Locale Detection Priority**
    - **Validates: Requirements 4.2, 4.3, 4.4, 4.6**
  
  - [x] 8.4 Write property test for URL locale recognition
    - **Property 9: Middleware URL Locale Recognition**
    - **Validates: Requirements 4.1, 4.5**
  
  - [x] 8.5 Write property test for Accept-Language fairness
    - **Property 10: Accept-Language Parsing Fairness**
    - **Validates: Requirements 4.7**

- [ ] 9. Checkpoint - Verify routing and UI
  - Ensure all tests pass, manually test language switcher and routing, ask the user if questions arise.


- [ ] 10. Add SEO metadata and hreflang tags
  - [ ] 10.1 Update metadata generation for all locales
    - Add hreflang tags for all five locales in page metadata
    - Include x-default hreflang pointing to French version
    - Ensure absolute URLs for all hreflang tags
    - Add language-specific title and description metadata
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ] 10.2 Write unit tests for SEO metadata
    - Test hreflang tags include all five locales
    - Test x-default points to French version
    - Test hreflang URLs are absolute and correctly formatted
    - Test URL structure is consistent across locales
    - _Requirements: 6.1, 6.2, 6.3, 6.5_
  
  - [ ] 10.3 Write property test for hreflang completeness
    - **Property 11: Hreflang Tag Completeness**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**
  
  - [ ] 10.4 Write property test for URL structure consistency
    - **Property 12: URL Structure Consistency**
    - **Validates: Requirements 6.5**

- [ ] 11. Implement error handling and validation
  - [ ] 11.1 Add error handling to translation system
    - Add console warning for missing translation keys
    - Return key as fallback when translation not found
    - Add try-catch for Accept-Language parsing errors
    - Validate cookie locale values before use
    - Add error handling for language switcher navigation
    - _Requirements: 7.2_
  
  - [ ] 11.2 Write unit tests for error handling
    - Test missing translation key returns key as fallback
    - Test invalid locale falls back to default
    - Test malformed Accept-Language header is handled gracefully
    - Test invalid cookie value is ignored
    - _Requirements: 7.2_
  
  - [ ] 11.3 Write property test for special character handling
    - **Property 13: Special Character Handling**
    - **Validates: Requirements 7.4**

- [ ] 12. Implement backward compatibility tests
  - [ ] 12.1 Write property test for backward compatibility
    - **Property 14: Backward Compatibility**
    - **Validates: Requirements 8.1, 8.2, 8.3**
  
  - [ ] 12.2 Run existing test suite
    - Execute all existing tests to verify no regressions
    - Verify French and English functionality unchanged
    - _Requirements: 8.4, 8.5_

- [ ] 13. Add cultural adaptation utilities
  - [ ] 13.1 Create date and number formatting utilities
    - Add date formatting function for each locale
    - Add number formatting function for each locale
    - Add currency formatting function for each locale
    - Ensure all locales use LTR text direction
    - _Requirements: 9.1, 9.2, 9.4, 9.5_
  
  - [ ] 13.2 Write unit tests for cultural adaptations
    - Test date formats for each locale
    - Test number formats for each locale
    - Test currency formats for each locale
    - _Requirements: 9.1, 9.2, 9.4_
  
  - [ ] 13.3 Write property test for text direction
    - **Property 15: Text Direction Consistency**
    - **Validates: Requirements 9.5**


- [ ] 14. Optimize performance and loading
  - [ ] 14.1 Verify translation data loading efficiency
    - Ensure only current locale translations are loaded in client bundle
    - Verify no unnecessary locale data is included
    - _Requirements: 10.1_
  
  - [ ] 14.2 Write property test for loading efficiency
    - **Property 16: Translation Data Loading Efficiency**
    - **Validates: Requirements 10.1**
  
  - [ ] 14.3 Measure performance benchmarks
    - Measure initial page load time with 5 locales
    - Measure language switch transition time
    - Verify load time increase is < 50ms
    - Verify language switch completes in < 500ms
    - _Requirements: 10.2, 10.4, 10.5_

- [ ] 15. Add accessibility features
  - [ ] 15.1 Write accessibility tests for language switcher
    - Test keyboard navigation (Tab, Enter, Escape)
    - Test ARIA attributes are correct
    - Test focus management when opening/closing dropdown
    - Test screen reader compatibility
    - _Requirements: 3.2_

- [ ] 16. Integration testing
  - [ ] 16.1 Write end-to-end tests for multilingual functionality
    - Test full user journey: browse site, switch languages, see translated content
    - Test cookie persistence across page navigations
    - Test all five locales work correctly
    - Test language switcher in both light and dark modes
    - _Requirements: 3.1, 3.3, 3.4, 4.2, 4.5_

- [ ] 17. Final checkpoint and validation
  - Ensure all tests pass (unit, property, integration)
  - Verify TypeScript compilation succeeds with no errors
  - Manually test language switching for all five locales
  - Verify translations display correctly for Spanish, German, Russian
  - Verify special characters render correctly (ñ, ü, ö, ä, Cyrillic)
  - Check SEO metadata and hreflang tags in browser dev tools
  - Test in multiple browsers (Chrome, Firefox, Safari, Edge)
  - Ask the user if questions arise or if ready for deployment

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples, edge cases, and error conditions
- Translation quality should be reviewed by native speakers before production deployment
- Consider using professional translation services for Spanish, German, and Russian content
- The architecture supports future language additions with minimal changes
