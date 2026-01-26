import { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Run accessibility tests on a page using axe-core
 * @param page - Playwright page object
 * @param options - Optional configuration for axe
 * @returns Accessibility scan results
 */
export async function checkA11y(
  page: Page,
  options?: {
    exclude?: string[];
    include?: string[];
    disableRules?: string[];
  }
) {
  const builder = new AxeBuilder({ page });

  if (options?.exclude) {
    builder.exclude(options.exclude);
  }

  if (options?.include) {
    builder.include(options.include);
  }

  if (options?.disableRules) {
    builder.disableRules(options.disableRules);
  }

  const results = await builder.analyze();
  return results;
}

/**
 * Assert that a page has no accessibility violations
 * @param page - Playwright page object
 * @param options - Optional configuration for axe
 */
export async function expectNoA11yViolations(
  page: Page,
  options?: {
    exclude?: string[];
    include?: string[];
    disableRules?: string[];
  }
) {
  const results = await checkA11y(page, options);

  if (results.violations.length > 0) {
    const violationMessages = results.violations.map((violation) => {
      return `
[${violation.id}] ${violation.description}
  Impact: ${violation.impact}
  Help: ${violation.help}
  Nodes: ${violation.nodes.length}
  ${violation.nodes.map((node) => `    - ${node.html}`).join('\n')}
      `;
    });

    throw new Error(
      `Accessibility violations found:\n${violationMessages.join('\n')}`
    );
  }
}
