/**
 * TrustStripDark Component Tests
 * 
 * Tests for the dark premium trust strip component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TrustStripDark, TrustItem } from '../TrustStripDark';
import { TrustIconsDark } from '../TrustIconsDark';
import { getDefaultTrustItemsDark } from '../TrustStripDarkHelpers';

describe('TrustStripDark', () => {
  const mockItems: TrustItem[] = [
    {
      icon: <TrustIconsDark.Clock />,
      label: '24h',
      tooltip: 'Réponse sous 24 heures',
    },
    {
      icon: <TrustIconsDark.Shield />,
      label: 'NDA',
      tooltip: 'NDA disponible',
    },
    {
      icon: <TrustIconsDark.Leaf />,
      label: 'EUDR',
      tooltip: 'Conforme EUDR',
    },
  ];

  it('renders trust items correctly', () => {
    render(<TrustStripDark items={mockItems} />);
    
    expect(screen.getByText('24h')).toBeDefined();
    expect(screen.getByText('NDA')).toBeDefined();
    expect(screen.getByText('EUDR')).toBeDefined();
  });

  it('renders with compact variant', () => {
    const { container } = render(<TrustStripDark items={mockItems} variant="compact" />);
    expect(container.firstChild).toBeDefined();
  });

  it('renders with detailed variant', () => {
    const { container } = render(<TrustStripDark items={mockItems} variant="detailed" />);
    expect(container.firstChild).toBeDefined();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TrustStripDark items={mockItems} className="custom-class" />
    );
    const element = container.firstChild as HTMLElement;
    expect(element.className).toContain('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(<TrustStripDark items={mockItems} />);
    
    const list = screen.getByRole('list', { name: 'Trust indicators' });
    expect(list).toBeDefined();
  });
});

describe('getDefaultTrustItemsDark', () => {
  const translations = {
    response24h: '24h',
    response24hTooltip: 'Réponse sous 24 heures',
    ndaAvailable: 'NDA',
    ndaAvailableTooltip: 'NDA disponible',
    eudrCompliant: 'EUDR',
    eudrCompliantTooltip: 'Conforme EUDR',
    qaDocumented: 'QA',
    qaDocumentedTooltip: 'QA documentée',
    coaAvailable: 'COA',
    coaAvailableTooltip: 'COA disponibles',
  };

  it('returns 5 default trust items', () => {
    const items = getDefaultTrustItemsDark(translations);
    expect(items).toHaveLength(5);
  });

  it('includes all required trust items', () => {
    const items = getDefaultTrustItemsDark(translations);
    
    expect(items[0].label).toBe('24h');
    expect(items[1].label).toBe('NDA');
    expect(items[2].label).toBe('EUDR');
    expect(items[3].label).toBe('QA');
    expect(items[4].label).toBe('COA');
  });

  it('includes tooltips for all items', () => {
    const items = getDefaultTrustItemsDark(translations);
    
    items.forEach(item => {
      expect(item.tooltip).toBeDefined();
    });
  });

  it('uses label as tooltip fallback when tooltip not provided', () => {
    const minimalTranslations = {
      response24h: '24h',
      ndaAvailable: 'NDA',
      eudrCompliant: 'EUDR',
      qaDocumented: 'QA',
      coaAvailable: 'COA',
    };

    const items = getDefaultTrustItemsDark(minimalTranslations);
    
    expect(items[0].tooltip).toBe('24h');
    expect(items[1].tooltip).toBe('NDA');
  });
});

describe('TrustIconsDark', () => {
  it('Clock icon renders', () => {
    const { container } = render(<TrustIconsDark.Clock />);
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('Shield icon renders', () => {
    const { container } = render(<TrustIconsDark.Shield />);
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('Leaf icon renders', () => {
    const { container } = render(<TrustIconsDark.Leaf />);
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('CheckCircle icon renders', () => {
    const { container } = render(<TrustIconsDark.CheckCircle />);
    expect(container.querySelector('svg')).toBeDefined();
  });

  it('FileText icon renders', () => {
    const { container } = render(<TrustIconsDark.FileText />);
    expect(container.querySelector('svg')).toBeDefined();
  });
});
