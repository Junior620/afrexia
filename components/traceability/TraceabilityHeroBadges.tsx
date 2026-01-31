import { Database, MapPin, FileCheck, Lock } from 'lucide-react';

export interface TraceabilityBadge {
  label: string;
  icon: string;
}

interface TraceabilityHeroBadgesProps {
  badges: TraceabilityBadge[];
}

const iconMap: Record<string, any> = {
  'database': Database,
  'map-pin': MapPin,
  'file-check': FileCheck,
  'lock': Lock,
};

export function TraceabilityHeroBadges({ badges }: TraceabilityHeroBadgesProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-8">
      {badges.map((badge, index) => {
        const Icon = iconMap[badge.icon] || FileCheck;
        return (
          <div
            key={index}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[rgba(10,20,16,0.6)] border border-[rgba(74,154,98,0.3)] rounded-full backdrop-blur-sm"
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
