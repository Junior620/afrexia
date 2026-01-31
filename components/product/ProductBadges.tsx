'use client';

import { cn } from '@/lib/utils';

interface Badge {
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning';
}

interface ProductBadgesProps {
  badges: Badge[];
  className?: string;
}

/**
 * ProductBadges - Subtle premium badges for B2B trust signals
 * EUDR-ready, QA documentée, COA disponible, etc.
 */
export function ProductBadges({ badges, className }: ProductBadgesProps) {
  const getVariantStyles = (variant: Badge['variant'] = 'default') => {
    switch (variant) {
      case 'success':
        return 'bg-[rgba(74,154,98,0.15)] border-[rgba(74,154,98,0.3)] text-[#4A9A62]';
      case 'warning':
        return 'bg-[rgba(168,152,88,0.15)] border-[rgba(168,152,88,0.3)] text-[#A89858]';
      default:
        return 'bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.08)] text-[rgba(255,255,255,0.85)]';
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {badges.map((badge, index) => (
        <div
          key={index}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-sm',
            getVariantStyles(badge.variant)
          )}
        >
          {badge.icon && (
            <span className="w-3.5 h-3.5">
              {badge.icon}
            </span>
          )}
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
