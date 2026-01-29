import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrustStrip, TrustIcons, getDefaultTrustItems } from '../TrustStrip';

describe('TrustStrip', () => {
  const mockTranslations = {
    response24h: '24h Response',
    ndaAvailable: 'NDA Available',
    eudrCompliant: 'EUDR Compliant',
    qaDocumented: 'QA Documented',
    coaAvailable: 'COA & Spec Sheets',
  };

  it('renders all trust items', () => {
    const items = getDefaultTrustItems(mockTranslations);
    render(<TrustStrip items={items} />);

    expect(screen.getByText('24h Response')).toBeDefined();
    expect(screen.getByText('NDA Available')).toBeDefined();
    expect(screen.getByText('EUDR Compliant')).toBeDefined();
    expect(screen.getByText('QA Documented')).toBeDefined();
    expect(screen.getByText('COA & Spec Sheets')).toBeDefined();
  });

  it('renders with compact variant by default', () => {
    const items = [
      {
        icon: <TrustIcons.Clock />,
        label: '24h Response',
      },
    ];
    const { container } = render(<TrustStrip items={items} />);
    
    expect(container.querySelector('[role="list"]')).toBeDefined();
  });

  it('renders with detailed variant', () => {
    const items = [
      {
        icon: <TrustIcons.Clock />,
        label: '24h Response',
        tooltip: 'We respond within 24 hours',
      },
    ];
    render(<TrustStrip items={items} variant="detailed" />);
    
    expect(screen.getByText('24h Response')).toBeDefined();
  });

  it('renders custom items', () => {
    const customItems = [
      {
        icon: <TrustIcons.Checkmark />,
        label: 'Custom Trust Item',
        tooltip: 'Custom tooltip',
      },
    ];
    render(<TrustStrip items={customItems} />);

    expect(screen.getByText('Custom Trust Item')).toBeDefined();
  });

  it('applies custom className', () => {
    const items = [
      {
        icon: <TrustIcons.Clock />,
        label: '24h Response',
      },
    ];
    const { container } = render(
      <TrustStrip items={items} className="custom-class" />
    );

    expect(container.querySelector('.custom-class')).toBeDefined();
  });

  it('has proper accessibility attributes', () => {
    const items = getDefaultTrustItems(mockTranslations);
    render(<TrustStrip items={items} />);

    const list = screen.getByRole('list', { name: 'Trust indicators' });
    expect(list).toBeDefined();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(5);
  });
});
