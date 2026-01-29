/**
 * Unit tests for PartnerSection component
 * 
 * Tests:
 * - Component renders without crashing
 * - Content loads correctly for FR and EN locales
 * - Fallback logic for missing content
 * - Section wrapper has correct styling
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PartnerSection } from '../index';

// Mock the ErrorBoundary component
vi.mock('@/components/providers/ErrorBoundary', () => ({
  ErrorBoundary: ({ children, fallback }: any) => {
    if (!children) return fallback;
    return children;
  },
}));

describe('PartnerSection', () => {
  it('renders without crashing with French locale', () => {
    render(<PartnerSection locale="fr" />);
    
    // Check that the section is rendered
    const section = screen.getByTestId('partner-section');
    expect(section).toBeDefined();
  });

  it('renders without crashing with English locale', () => {
    render(<PartnerSection locale="en" />);
    
    const section = screen.getByTestId('partner-section');
    expect(section).toBeDefined();
  });

  it('displays French content correctly', () => {
    render(<PartnerSection locale="fr" />);
    
    // Check for French content
    expect(screen.getByText('Partenaire opérationnel')).toBeDefined();
    // Title appears twice (mobile and desktop versions)
    expect(screen.getAllByText('Afexia × SCPB SARL')).toHaveLength(2);
    expect(screen.getByText(/Un ancrage local solide/)).toBeDefined();
  });

  it('displays English content correctly', () => {
    render(<PartnerSection locale="en" />);
    
    // Check for English content
    expect(screen.getByText('Operational partner')).toBeDefined();
    // Title appears twice (mobile and desktop versions)
    expect(screen.getAllByText('Afexia × SCPB SARL')).toHaveLength(2);
    expect(screen.getByText(/Strong local presence/)).toBeDefined();
  });

  it('falls back to English when locale content is unavailable', () => {
    // Test with a locale that should fallback to English (es, de, ru use English content)
    render(<PartnerSection locale="es" />);
    
    // Should display English content
    expect(screen.getByText('Operational partner')).toBeDefined();
  });

  it('accepts custom content override', () => {
    const customContent = {
      partnerName: 'Custom Partner',
      relationship: 'Test relationship',
      partnerUrl: 'https://example.com',
      eyebrow: 'Custom Eyebrow',
      title: 'Custom Title',
      subtitle: 'Custom subtitle text',
      bodyText: ['Custom body text'],
      keyFacts: ['Fact 1', 'Fact 2', 'Fact 3'],
      primaryCTA: { label: 'Primary', href: 'https://example.com', external: true },
      secondaryCTA: { label: 'Secondary', href: '/test', external: false },
      trustMicrocopy: 'Trust text',
      images: [
        { src: '/test1.jpg', alt: 'Test 1', priority: true },
        { src: '/test2.jpg', alt: 'Test 2', priority: false },
      ],
      photoCaption: 'Test caption',
    };

    render(<PartnerSection locale="fr" content={customContent} />);
    
    expect(screen.getByText('Custom Eyebrow')).toBeDefined();
    // Title appears twice (mobile and desktop versions)
    expect(screen.getAllByText('Custom Title')).toHaveLength(2);
    expect(screen.getByText('Custom subtitle text')).toBeDefined();
  });

  it('applies correct section wrapper styling', () => {
    render(<PartnerSection locale="fr" />);
    
    const section = screen.getByTestId('partner-section');
    
    // Check for responsive padding classes
    expect(section.className).toContain('py-24');
    expect(section.className).toContain('md:py-24');
  });

  it('applies max-width constraint to content wrapper', () => {
    render(<PartnerSection locale="fr" />);
    
    const section = screen.getByTestId('partner-section');
    const wrapper = section.querySelector('.max-w-\\[1200px\\]');
    
    expect(wrapper).toBeDefined();
    expect(wrapper).not.toBeNull();
  });

  it('accepts additional className prop', () => {
    render(<PartnerSection locale="fr" className="custom-class" />);
    
    const section = screen.getByTestId('partner-section');
    expect(section.className).toContain('custom-class');
  });
});
