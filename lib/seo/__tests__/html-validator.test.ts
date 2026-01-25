import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  extractHeadings,
  validateHeadingHierarchy,
  hasSemanticElements,
  validateSemanticStructure,
  type HeadingNode,
} from '../html-validator';

/**
 * Property 23: Semantic HTML hierarchy
 * 
 * **Validates: Requirements 6.6**
 * 
 * This property verifies that HTML content follows semantic structure rules:
 * - Proper heading hierarchy (h1-h6)
 * - No skipped heading levels
 * - Exactly one h1 per page
 * - Use of semantic HTML5 elements
 */
describe('Property 23: Semantic HTML hierarchy', () => {
  describe('Heading extraction', () => {
    it('should correctly extract all headings from HTML', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              level: fc.integer({ min: 1, max: 6 }),
              text: fc
                .string({ minLength: 1, maxLength: 50 })
                .filter(s => {
                  const trimmed = s.trim();
                  // Filter out empty strings and strings containing HTML-like patterns
                  return trimmed.length > 0 && !/<[^>]*>/.test(trimmed);
                }),
            }),
            { minLength: 0, maxLength: 10 }
          ),
          (headingData) => {
            // Generate HTML with headings
            const html = headingData
              .map((h) => `<h${h.level}>${h.text}</h${h.level}>`)
              .join('\n');

            // Extract headings
            const extracted = extractHeadings(html);

            // Property: Number of extracted headings must match input
            expect(extracted.length).toBe(headingData.length);

            // Property: Each heading must match input data (trimmed)
            extracted.forEach((heading, index) => {
              expect(heading.level).toBe(headingData[index].level);
              expect(heading.text).toBe(headingData[index].text.trim());
              expect(heading.position).toBe(index);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle headings with nested HTML tags', () => {
      const html = `
        <h1>Main <strong>Title</strong></h1>
        <h2>Subtitle with <em>emphasis</em></h2>
        <h3>Section with <a href="#">link</a></h3>
      `;

      const headings = extractHeadings(html);

      // Property: Should extract text content without HTML tags
      expect(headings[0].text).toBe('Main Title');
      expect(headings[1].text).toBe('Subtitle with emphasis');
      expect(headings[2].text).toBe('Section with link');
    });
  });

  describe('Valid heading hierarchies', () => {
    it('should validate correct heading hierarchies', () => {
      // Valid hierarchies to test
      const validHierarchies: HeadingNode[][] = [
        // Single h1
        [{ level: 1, text: 'Title', position: 0 }],
        // h1 followed by h2
        [
          { level: 1, text: 'Title', position: 0 },
          { level: 2, text: 'Subtitle', position: 1 },
        ],
        // h1, h2, h3 progression
        [
          { level: 1, text: 'Title', position: 0 },
          { level: 2, text: 'Section', position: 1 },
          { level: 3, text: 'Subsection', position: 2 },
        ],
        // h1, h2, h3, back to h2
        [
          { level: 1, text: 'Title', position: 0 },
          { level: 2, text: 'Section 1', position: 1 },
          { level: 3, text: 'Subsection', position: 2 },
          { level: 2, text: 'Section 2', position: 3 },
        ],
        // Multiple h2s under h1
        [
          { level: 1, text: 'Title', position: 0 },
          { level: 2, text: 'Section 1', position: 1 },
          { level: 2, text: 'Section 2', position: 2 },
          { level: 2, text: 'Section 3', position: 3 },
        ],
      ];

      validHierarchies.forEach((hierarchy) => {
        const result = validateHeadingHierarchy(hierarchy);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should allow going down multiple levels but not skipping when going up', () => {
      // h1 -> h2 -> h3 -> h2 is valid (can jump down from h3 to h2)
      const hierarchy: HeadingNode[] = [
        { level: 1, text: 'Title', position: 0 },
        { level: 2, text: 'Section', position: 1 },
        { level: 3, text: 'Subsection', position: 2 },
        { level: 2, text: 'Another section', position: 3 },
      ];

      const result = validateHeadingHierarchy(hierarchy);
      expect(result.valid).toBe(true);
    });
  });

  describe('Invalid heading hierarchies', () => {
    it('should detect missing h1', () => {
      const hierarchy: HeadingNode[] = [
        { level: 2, text: 'Section', position: 0 },
        { level: 3, text: 'Subsection', position: 1 },
      ];

      const result = validateHeadingHierarchy(hierarchy);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing h1 heading');
      expect(result.errors).toContain('First heading is h2, should be h1');
    });

    it('should detect multiple h1s', () => {
      const hierarchy: HeadingNode[] = [
        { level: 1, text: 'Title 1', position: 0 },
        { level: 2, text: 'Section', position: 1 },
        { level: 1, text: 'Title 2', position: 2 },
      ];

      const result = validateHeadingHierarchy(hierarchy);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Multiple h1 headings'))).toBe(true);
    });

    it('should detect skipped heading levels', () => {
      const hierarchy: HeadingNode[] = [
        { level: 1, text: 'Title', position: 0 },
        { level: 3, text: 'Subsection', position: 1 }, // Skipped h2
      ];

      const result = validateHeadingHierarchy(hierarchy);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes('Heading level skipped'))).toBe(true);
    });

    it('should detect h1 not being first', () => {
      const hierarchy: HeadingNode[] = [
        { level: 2, text: 'Section', position: 0 },
        { level: 1, text: 'Title', position: 1 },
      ];

      const result = validateHeadingHierarchy(hierarchy);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('First heading is h2, should be h1');
    });
  });

  describe('Property-based heading hierarchy validation', () => {
    // Generator for valid heading hierarchies
    const validHierarchyArbitrary = fc
      .array(fc.integer({ min: 2, max: 4 }), { minLength: 0, maxLength: 10 })
      .map((levels) => {
        // Always start with h1
        const allLevels = [1, ...levels];
        
        // Fix any level skips - track max level seen
        const fixedLevels: number[] = [];
        let maxLevelSeen = 0;
        
        for (const level of allLevels) {
          if (level > maxLevelSeen + 1) {
            // Skip detected, use maxLevel + 1 instead
            fixedLevels.push(maxLevelSeen + 1);
            maxLevelSeen = maxLevelSeen + 1;
          } else {
            fixedLevels.push(level);
            if (level > maxLevelSeen) {
              maxLevelSeen = level;
            }
          }
        }

        return fixedLevels.map((level, index) => ({
          level,
          text: `Heading ${index}`,
          position: index,
        }));
      });

    it('should always validate correctly generated hierarchies', () => {
      fc.assert(
        fc.property(validHierarchyArbitrary, (hierarchy) => {
          const result = validateHeadingHierarchy(hierarchy);

          // Property: Valid hierarchies must pass validation
          expect(result.valid).toBe(true);
          expect(result.errors).toHaveLength(0);

          // Property: Must have exactly one h1
          const h1Count = hierarchy.filter((h) => h.level === 1).length;
          expect(h1Count).toBe(1);

          // Property: First heading must be h1
          expect(hierarchy[0].level).toBe(1);

          // Property: No level skips going up
          let maxLevelSeen = 0;
          for (let i = 0; i < hierarchy.length; i++) {
            const currentLevel = hierarchy[i].level;
            if (currentLevel > maxLevelSeen) {
              expect(currentLevel).toBeLessThanOrEqual(maxLevelSeen + 1);
              maxLevelSeen = currentLevel;
            }
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Semantic HTML elements', () => {
    it('should detect presence of semantic elements', () => {
      const htmlWithSemantic = `
        <header>
          <nav>Navigation</nav>
        </header>
        <main>
          <article>
            <section>Content</section>
          </article>
          <aside>Sidebar</aside>
        </main>
        <footer>Footer</footer>
      `;

      expect(hasSemanticElements(htmlWithSemantic)).toBe(true);
    });

    it('should detect absence of semantic elements', () => {
      const htmlWithoutSemantic = `
        <div class="header">
          <div class="nav">Navigation</div>
        </div>
        <div class="content">
          <div class="article">Content</div>
        </div>
      `;

      expect(hasSemanticElements(htmlWithoutSemantic)).toBe(false);
    });

    it('should validate complete semantic structure', () => {
      const completeHtml = `
        <header>Header</header>
        <main>Main content</main>
        <footer>Footer</footer>
      `;

      const result = validateSemanticStructure(completeHtml);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing semantic elements', () => {
      const incompleteHtml = `
        <div>Some content</div>
      `;

      const result = validateSemanticStructure(incompleteHtml);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors).toContain('Missing <main> element for main content');
      expect(result.errors).toContain('Missing <header> element');
      expect(result.errors).toContain('Missing <footer> element');
    });
  });

  describe('Integration: Full page validation', () => {
    it('should validate a complete semantic page structure', () => {
      const validPage = `
        <!DOCTYPE html>
        <html>
          <head><title>Test Page</title></head>
          <body>
            <header>
              <h1>Main Page Title</h1>
              <nav>Navigation</nav>
            </header>
            <main>
              <article>
                <h2>Article Title</h2>
                <section>
                  <h3>Section Title</h3>
                  <p>Content</p>
                </section>
                <section>
                  <h3>Another Section</h3>
                  <p>More content</p>
                </section>
              </article>
              <aside>
                <h2>Sidebar</h2>
              </aside>
            </main>
            <footer>
              <p>Footer content</p>
            </footer>
          </body>
        </html>
      `;

      // Validate heading hierarchy
      const headings = extractHeadings(validPage);
      const hierarchyResult = validateHeadingHierarchy(headings);
      expect(hierarchyResult.valid).toBe(true);

      // Validate semantic structure
      const structureResult = validateSemanticStructure(validPage);
      expect(structureResult.valid).toBe(true);

      // Validate semantic elements present
      expect(hasSemanticElements(validPage)).toBe(true);
    });
  });
});
