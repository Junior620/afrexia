/**
 * ProcessComplianceSection Component Example
 * 
 * This component displays quality standards, traceability process, and certifications
 * in a 3-column grid layout (responsive to 1-column on mobile).
 * 
 * Usage:
 * ```tsx
 * import { ProcessComplianceSection } from '@/components/sections/ProcessComplianceSection';
 * 
 * export default function ProductCatalogPage({ params }: { params: { locale: string } }) {
 *   return (
 *     <main>
 *       {/* Other catalog components */}
 *       <ProcessComplianceSection locale={params.locale as Locale} />
 *     </main>
 *   );
 * }
 * ```
 * 
 * Features:
 * - Supports 5 locales: fr, en, es, de, ru
 * - Responsive 3-column grid (desktop) to 1-column (mobile)
 * - Animated with ScrollReveal for smooth entrance
 * - Dark mode support
 * - Icons for each section (quality, traceability, certifications)
 * - Checkmark bullets for list items
 * 
 * Requirements Validated:
 * - Requirement 6.9: Process and compliance section explaining quality and traceability
 */

import { ProcessComplianceSection } from './ProcessComplianceSection';

// Example 1: French locale
export function FrenchExample() {
  return <ProcessComplianceSection locale="fr" />;
}

// Example 2: English locale
export function EnglishExample() {
  return <ProcessComplianceSection locale="en" />;
}

// Example 3: Spanish locale
export function SpanishExample() {
  return <ProcessComplianceSection locale="es" />;
}

// Example 4: German locale
export function GermanExample() {
  return <ProcessComplianceSection locale="de" />;
}

// Example 5: Russian locale
export function RussianExample() {
  return <ProcessComplianceSection locale="ru" />;
}
