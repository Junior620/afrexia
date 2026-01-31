import { FileCheck, Shield, FileText, Lock, Clock } from 'lucide-react';

export interface QualityBadge {
  label: string;
  icon: string;
}

interface QualityHeroBadgesProps {
  badges: QualityBadge[];
}

const iconMap: Record<string, any> = {
  'file-check': FileCheck,
  'shield': Shield,
  'file-text': FileText,
  'lock': Lock,
  'clock': Clock,
};

export function QualityHeroBadges({ badges }: QualityHeroBadgesProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-8">
      {badges.map((badge, index) => {
        const Icon = iconMap[badge.icon] || FileCheck;
        return (
          <div
            key={index}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(74,154,98,0.15)] border border-[rgba(74,154,98,0.3)] rounded-lg backdrop-blur-sm"
          >
            <Icon className="w-4 h-4 text-[#A89858]" />
            <span className="text-sm font-medium text-[#E8F5E9]">
              {badge.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
