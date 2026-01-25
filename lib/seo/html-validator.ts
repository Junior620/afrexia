/**
 * HTML Semantic Validation Utilities
 * 
 * These utilities validate semantic HTML structure, particularly heading hierarchy.
 */

export interface HeadingNode {
  level: number;
  text: string;
  position: number;
}

/**
 * Extract heading hierarchy from HTML string
 */
export function extractHeadings(html: string): HeadingNode[] {
  const headings: HeadingNode[] = [];
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
  let match;
  let position = 0;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].replace(/<[^>]*>/g, '').trim(); // Strip inner HTML tags
    headings.push({ level, text, position: position++ });
  }

  return headings;
}

/**
 * Validate heading hierarchy follows semantic rules
 * 
 * Rules:
 * 1. Must have exactly one h1
 * 2. Headings must not skip levels when going up (e.g., h1 -> h3 is invalid, but h3 -> h1 is ok)
 * 3. h1 must be the first heading
 */
export function validateHeadingHierarchy(headings: HeadingNode[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Rule 1: Must have at least one heading
  if (headings.length === 0) {
    return { valid: true, errors: [] }; // Empty is valid (no content)
  }

  // Rule 2: Must have exactly one h1
  const h1Count = headings.filter((h) => h.level === 1).length;
  if (h1Count === 0) {
    errors.push('Missing h1 heading');
  } else if (h1Count > 1) {
    errors.push(`Multiple h1 headings found (${h1Count})`);
  }

  // Rule 3: h1 must be the first heading
  if (headings.length > 0 && headings[0].level !== 1) {
    errors.push(`First heading is h${headings[0].level}, should be h1`);
  }

  // Rule 4: Headings must not skip levels when going up
  // Track the highest level seen so far to allow proper nesting
  let maxLevelSeen = 0;
  
  for (let i = 0; i < headings.length; i++) {
    const currentLevel = headings[i].level;

    // Update max level seen
    if (currentLevel > maxLevelSeen) {
      // Going up in depth (h2 -> h3)
      // Can only go up one level at a time from the max we've seen
      if (currentLevel > maxLevelSeen + 1) {
        errors.push(
          `Heading level skipped: jumped from h${maxLevelSeen} to h${currentLevel} at position ${i} ("${headings[i].text}")`
        );
      }
      maxLevelSeen = currentLevel;
    }
    // Going down or staying same is always ok (h4 -> h2, h2 -> h2)
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if HTML contains semantic elements
 */
export function hasSemanticElements(html: string): boolean {
  const semanticTags = [
    'header',
    'nav',
    'main',
    'article',
    'section',
    'aside',
    'footer',
  ];

  return semanticTags.some((tag) => {
    const regex = new RegExp(`<${tag}[^>]*>`, 'i');
    return regex.test(html);
  });
}

/**
 * Validate that main content is wrapped in semantic tags
 */
export function validateSemanticStructure(html: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check for main tag
  if (!/<main[^>]*>/i.test(html)) {
    errors.push('Missing <main> element for main content');
  }

  // Check for header tag
  if (!/<header[^>]*>/i.test(html)) {
    errors.push('Missing <header> element');
  }

  // Check for footer tag
  if (!/<footer[^>]*>/i.test(html)) {
    errors.push('Missing <footer> element');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
