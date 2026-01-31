'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DescriptionExpanderProps {
  description: string;
  locale: 'fr' | 'en';
  maxLines?: number;
}

/**
 * DescriptionExpander - Accordion for product description
 * Shows truncated text with "Lire plus" / "Read more" expansion
 */
export function DescriptionExpander({
  description,
  locale,
  maxLines = 3,
}: DescriptionExpanderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Split description into paragraphs
  const paragraphs = description.split('\n\n').filter(p => p.trim());
  
  // Check if description needs expansion
  const needsExpansion = paragraphs.length > 1 || description.length > 300;

  if (!needsExpansion) {
    return (
      <div className="prose prose-sm max-w-none">
        <p className="text-[#C5D9C0] leading-relaxed">
          {description}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="prose prose-sm max-w-none">
        <p className={cn(
          'text-[#C5D9C0] leading-relaxed transition-all duration-300',
          !isExpanded && `line-clamp-${maxLines}`
        )}>
          {isExpanded ? description : paragraphs[0]}
        </p>
        
        {isExpanded && paragraphs.length > 1 && (
          <div className="mt-4 space-y-4">
            {paragraphs.slice(1).map((paragraph, index) => (
              <p key={index} className="text-[#C5D9C0] leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'inline-flex items-center gap-1.5 mt-3',
          'text-sm text-[#A89858] hover:text-[#B8A868] font-medium',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[#A89858] focus:ring-offset-2 focus:ring-offset-[#0A1410]',
          'rounded-lg px-2 py-1'
        )}
      >
        <span>{isExpanded 
          ? (locale === 'fr' ? 'Voir moins' : 'Show less')
          : (locale === 'fr' ? 'Lire plus' : 'Read more')
        }</span>
        <svg 
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            isExpanded && 'rotate-180'
          )} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
