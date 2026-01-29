/**
 * StatCards Component
 * 
 * Displays compact trust indicators with metrics in a responsive grid layout.
 * Optional component that only renders when stats data is provided.
 * 
 * Requirements:
 * - 12.1: Display 3 mini-stat cards with producer network, capacity, infrastructure
 * - 12.2: Compact design with bg-white/[0.03] and border-white/[0.06]
 * - 12.3: Conditional rendering - only render if stats array has items
 */

import { StatCard } from '@/types/partner-section';

interface StatCardsProps {
  stats?: StatCard[];
  className?: string;
}

/**
 * StatCards component
 * 
 * Renders a grid of statistical cards showing trust indicators.
 * Implements conditional rendering - only displays when stats are provided.
 * 
 * @param stats - Array of stat cards to display (optional)
 * @param className - Additional Tailwind CSS classes
 */
export function StatCards({ stats, className = '' }: StatCardsProps) {
  // Requirement 12.3: Conditional rendering - only render if stats array has items
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div
      className={`
        grid
        grid-cols-3
        gap-3
        ${className}
      `.trim()}
      data-testid="stat-cards"
      role="region"
      aria-label="Partner statistics"
    >
      {stats.map((stat, index) => (
        <article
          key={`${stat.label}-${index}`}
          className="
            bg-white/[0.03]
            border
            border-white/[0.06]
            rounded-xl
            p-3
          "
          data-testid="stat-card"
          aria-label={`${stat.label}: ${stat.value}`}
        >
          {/* Value - large, bold, primary text */}
          <div className="text-lg font-bold text-partner-text-primary mb-0.5" aria-hidden="true">
            {stat.value}
          </div>
          
          {/* Label - small, secondary text */}
          <div className="text-xs text-partner-text-secondary leading-tight" aria-hidden="true">
            {stat.label}
          </div>
        </article>
      ))}
    </div>
  );
}
