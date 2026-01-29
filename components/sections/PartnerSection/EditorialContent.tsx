/**
 * EditorialContent Component
 * 
 * Displays structured text content with typography hierarchy for the Partner Section.
 * Implements premium editorial styling with responsive font sizes and scannable layout.
 * 
 * Requirements:
 * - 4.1: Display eyebrow label
 * - 4.2: Display title (H2)
 * - 4.3: Display subtitle
 * - 4.4: Display body text (max 120 words)
 * - 4.5: Display exactly 3 key facts as bullet list
 * - 6.1: Primary text color #EDEDED
 * - 6.2: Secondary text color rgba(237,237,237,0.72)
 * - 6.5: Heading 42-52px desktop / 30-34px mobile
 * - 6.6: Body text 16-18px, line-height 1.6
 */

interface EditorialContentProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  bodyText: string[];
  keyFacts: string[];
  className?: string;
}

/**
 * EditorialContent component
 * 
 * Renders editorial content with sophisticated typography hierarchy.
 * Uses custom colors and responsive font sizes for premium aesthetic.
 * 
 * @param eyebrow - Small label above title
 * @param title - Main heading (H2)
 * @param subtitle - Supporting headline
 * @param bodyText - Array of paragraph strings (max 120 words total)
 * @param keyFacts - Array of bullet points (exactly 3)
 * @param className - Additional Tailwind CSS classes
 */
export function EditorialContent({
  eyebrow,
  title,
  subtitle,
  bodyText,
  keyFacts,
  className = ''
}: EditorialContentProps) {
  return (
    <article className={`space-y-4 ${className}`.trim()} data-testid="editorial-content">
      {/* Eyebrow: 12px uppercase, tracking-wide, accent color, font-semibold */}
      <p 
        className="text-xs uppercase tracking-wider text-accent font-semibold"
        data-testid="eyebrow"
        aria-label="Partner category"
      >
        {eyebrow}
      </p>

      {/* Title (H2): 42-52px desktop / 30-34px mobile, font-bold, primary text color */}
      <h2 
        id="partner-section-title"
        className="hidden md:block text-[38px] leading-[1.2] lg:text-[42px] font-bold text-partner-text-primary"
        data-testid="title"
      >
        {title}
      </h2>

      {/* Subtitle: 18-20px, font-medium, secondary text color */}
      <p 
        className="text-base md:text-lg font-medium text-partner-text-secondary leading-relaxed"
        data-testid="subtitle"
      >
        {subtitle}
      </p>

      {/* Body text: 16-18px, line-height 1.6, secondary text color */}
      <div className="space-y-3 mt-3" data-testid="body-text" role="region" aria-label="Partner description">
        {bodyText.map((paragraph, index) => (
          <p 
            key={index}
            className="text-sm md:text-base leading-[1.6] text-partner-text-secondary text-justify"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Key facts: 16px, bullet list with custom accent color dot markers */}
      <ul className="space-y-2.5 mt-4" data-testid="key-facts" role="list" aria-label="Key capabilities">
        {keyFacts.slice(0, 3).map((fact, index) => (
          <li 
            key={index}
            className="flex items-start gap-3 text-sm md:text-base text-partner-text-secondary"
          >
            <span 
              className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0"
              aria-hidden="true"
            />
            <span className="leading-relaxed">{fact}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
