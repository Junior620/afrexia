import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProductCardDark } from '../ProductCardDark';
import { Product } from '@/types/product';
import '@testing-library/jest-dom';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  },
}));

// Mock analytics
vi.mock('@/lib/analytics/events', () => ({
  trackQuoteClick: vi.fn(),
  trackSpecClick: vi.fn(),
}));

const mockProduct: Product = {
  id: 'test-product-1',
  slug: 'test-product',
  name: 'Cacao Premium Côte d\'Ivoire',
  subtitle: 'Fèves fermentées grade A',
  category: 'Cacao',
  heroImage: {
    asset: {
      _ref: 'image-abc123-800x600-jpg',
      _type: 'reference',
    },
  },
  availability: 'in-stock',
  origins: ['Côte d\'Ivoire'],
  certifications: ['organic', 'fairtrade'],
  eudrReady: true,
  qaAvailable: true,
  documents: {
    coa: true,
    specSheet: true,
    chainOfCustody: true,
  },
  moq: {
    value: 500,
    unit: 'kg',
  },
  incoterms: ['FOB', 'CIF', 'DAP'],
  tags: ['premium', 'organic'],
  markets: ['EU', 'US'],
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockTranslations = {
  requestQuote: 'Demander un devis',
  viewSpecs: 'Voir fiche technique',
  origin: 'Origine',
  moq: 'MOQ',
  incoterm: 'Incoterms',
  microproof: 'Réponse sous 24h • NDA possible',
  badges: {
    available: 'Disponible',
    onRequest: 'Sur demande',
    outOfStock: 'Épuisé',
    eudrReady: 'EUDR-ready',
  },
  documents: {
    coa: 'Certificate of Analysis',
    specSheet: 'Specification Sheet',
    chainOfCustody: 'Chain of Custody',
  },
};

describe('ProductCardDark', () => {
  it('renders product name and subtitle', () => {
    const onQuoteClick = vi.fn();
    
    render(
      <ProductCardDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        onQuoteClick={onQuoteClick}
      />
    );

    expect(screen.getByText('Cacao Premium Côte d\'Ivoire')).toBeInTheDocument();
    expect(screen.getByText('Fèves fermentées grade A')).toBeInTheDocument();
  });

  it('displays availability badge', () => {
    const onQuoteClick = vi.fn();
    
    render(
      <ProductCardDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        onQuoteClick={onQuoteClick}
      />
    );

    expect(screen.getByText('Disponible')).toBeInTheDocument();
  });

  it('displays EUDR badge when product is EUDR ready', () => {
    const onQuoteClick = vi.fn();
    
    render(
      <ProductCardDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        onQuoteClick={onQuoteClick}
      />
    );

    expect(screen.getByText('EUDR-ready')).toBeInTheDocument();
  });

  it('displays quick specs (origin, MOQ, incoterms)', () => {
    const onQuoteClick = vi.fn();
    
    render(
      <ProductCardDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        onQuoteClick={onQuoteClick}
      />
    );

    expect(screen.getByText('Origine')).toBeInTheDocument();
    expect(screen.getByText('Côte d\'Ivoire')).toBeInTheDocument();
    expect(screen.getByText('MOQ')).toBeInTheDocument();
    expect(screen.getByText('500 kg')).toBeInTheDocument();
    expect(screen.getByText('Incoterms')).toBeInTheDocument();
    expect(screen.getByText('FOB, CIF, DAP')).toBeInTheDocument();
  });

  it('displays document indicators', () => {
    const onQuoteClick = vi.fn();
    
    render(
      <ProductCardDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        onQuoteClick={onQuoteClick}
      />
    );

    expect(screen.getByText('COA')).toBeInTheDocument();
    expect(screen.getByText('Spec')).toBeInTheDocument();
    expect(screen.getByText('Chain')).toBeInTheDocument();
  });

  it('calls onQuoteClick when quote button is clicked', () => {
    const onQuoteClick = vi.fn();
    
    render(
      <ProductCardDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        onQuoteClick={onQuoteClick}
      />
    );

    const quoteButton = screen.getByText('Demander un devis');
    fireEvent.click(quoteButton);

    expect(onQuoteClick).toHaveBeenCalledTimes(1);
  });

  it('renders spec link with correct href', () => {
    const onQuoteClick = vi.fn();
    
    render(
      <ProductCardDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        onQuoteClick={onQuoteClick}
      />
    );

    const specLink = screen.getByText(/Voir fiche technique/);
    expect(specLink).toHaveAttribute('href', '/fr/products/test-product');
  });

  it('displays microproof text', () => {
    const onQuoteClick = vi.fn();
    
    render(
      <ProductCardDark
        product={mockProduct}
        locale="fr"
        translations={mockTranslations}
        onQuoteClick={onQuoteClick}
      />
    );

    expect(screen.getByText('Réponse sous 24h • NDA possible')).toBeInTheDocument();
  });

  it('renders fallback pattern when no image is provided', () => {
    const productWithoutImage = {
      ...mockProduct,
      heroImage: null as any,
    };
    const onQuoteClick = vi.fn();
    
    render(
      <ProductCardDark
        product={productWithoutImage}
        locale="fr"
        translations={mockTranslations}
        onQuoteClick={onQuoteClick}
      />
    );

    // Check that the fallback pattern is rendered (first letter of product name)
    expect(screen.getByText('C')).toBeInTheDocument();
  });
});
