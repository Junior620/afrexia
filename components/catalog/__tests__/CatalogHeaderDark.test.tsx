/**
 * CatalogHeaderDark Component Tests
 * 
 * Tests for the dark premium catalog header component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CatalogHeaderDark } from '../CatalogHeaderDark';

const mockTranslationsFR = {
  heading: 'Catalogue Produits',
  subtitle: 'Cacao, café & commodités africaines — QA documentée, traçabilité prête pour audit.',
  ctaPrimary: 'Demander un devis',
  ctaSecondary: 'Télécharger le catalogue (PDF)',
  trust: {
    response24h: '24h',
    response24hTooltip: 'Réponse sous 24 heures',
    ndaAvailable: 'NDA',
    ndaAvailableTooltip: 'NDA disponible sur demande',
    eudrCompliant: 'EUDR',
    eudrCompliantTooltip: 'Conforme EUDR',
    qaDocumented: 'QA',
    qaDocumentedTooltip: 'Documentation QA complète',
    coaAvailable: 'COA',
    coaAvailableTooltip: 'COA & fiches techniques disponibles',
  },
};

const mockTranslationsEN = {
  heading: 'Product Catalog',
  subtitle: 'Cocoa, coffee & African commodities — Documented QA, audit-ready traceability.',
  ctaPrimary: 'Request a Quote',
  ctaSecondary: 'Download Catalog (PDF)',
  trust: {
    response24h: '24h',
    response24hTooltip: '24h response time',
    ndaAvailable: 'NDA',
    ndaAvailableTooltip: 'NDA available upon request',
    eudrCompliant: 'EUDR',
    eudrCompliantTooltip: 'EUDR compliant',
    qaDocumented: 'QA',
    qaDocumentedTooltip: 'Comprehensive QA documentation',
    coaAvailable: 'COA',
    coaAvailableTooltip: 'COA & spec sheets available',
  },
};

describe('CatalogHeaderDark', () => {
  it('renders with French translations', () => {
    const onRequestQuote = vi.fn();
    const onDownloadCatalog = vi.fn();

    render(
      <CatalogHeaderDark
        locale="fr"
        translations={mockTranslationsFR}
        onRequestQuote={onRequestQuote}
        onDownloadCatalog={onDownloadCatalog}
      />
    );

    // Check heading
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Catalogue Produits');

    // Check subtitle
    expect(screen.getByText(/Cacao, café & commodités africaines/)).toBeInTheDocument();

    // Check CTAs
    expect(screen.getByRole('button', { name: /Demander un devis/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Télécharger le catalogue/i })).toBeInTheDocument();

    // Check trust items
    expect(screen.getByText('24h')).toBeInTheDocument();
    expect(screen.getByText('NDA')).toBeInTheDocument();
    expect(screen.getByText('EUDR')).toBeInTheDocument();
    expect(screen.getByText('QA')).toBeInTheDocument();
    expect(screen.getByText('COA')).toBeInTheDocument();
  });

  it('renders with English translations', () => {
    const onRequestQuote = vi.fn();
    const onDownloadCatalog = vi.fn();

    render(
      <CatalogHeaderDark
        locale="en"
        translations={mockTranslationsEN}
        onRequestQuote={onRequestQuote}
        onDownloadCatalog={onDownloadCatalog}
      />
    );

    // Check heading
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Product Catalog');

    // Check subtitle
    expect(screen.getByText(/Cocoa, coffee & African commodities/)).toBeInTheDocument();

    // Check CTAs
    expect(screen.getByRole('button', { name: /Request a Quote/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download Catalog/i })).toBeInTheDocument();
  });

  it('calls onRequestQuote when primary CTA is clicked', () => {
    const onRequestQuote = vi.fn();
    const onDownloadCatalog = vi.fn();

    render(
      <CatalogHeaderDark
        locale="fr"
        translations={mockTranslationsFR}
        onRequestQuote={onRequestQuote}
        onDownloadCatalog={onDownloadCatalog}
      />
    );

    const primaryButton = screen.getByRole('button', { name: /Demander un devis/i });
    fireEvent.click(primaryButton);

    expect(onRequestQuote).toHaveBeenCalledTimes(1);
  });

  it('calls onDownloadCatalog when secondary CTA is clicked', () => {
    const onRequestQuote = vi.fn();
    const onDownloadCatalog = vi.fn();

    render(
      <CatalogHeaderDark
        locale="fr"
        translations={mockTranslationsFR}
        onRequestQuote={onRequestQuote}
        onDownloadCatalog={onDownloadCatalog}
      />
    );

    const secondaryButton = screen.getByRole('button', { name: /Télécharger le catalogue/i });
    fireEvent.click(secondaryButton);

    expect(onDownloadCatalog).toHaveBeenCalledTimes(1);
  });

  it('has proper semantic HTML structure', () => {
    const onRequestQuote = vi.fn();
    const onDownloadCatalog = vi.fn();

    render(
      <CatalogHeaderDark
        locale="fr"
        translations={mockTranslationsFR}
        onRequestQuote={onRequestQuote}
        onDownloadCatalog={onDownloadCatalog}
      />
    );

    // Check for header element with banner role
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe('HEADER');

    // Check for h1
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const onRequestQuote = vi.fn();
    const onDownloadCatalog = vi.fn();

    const { container } = render(
      <CatalogHeaderDark
        locale="fr"
        translations={mockTranslationsFR}
        onRequestQuote={onRequestQuote}
        onDownloadCatalog={onDownloadCatalog}
        className="custom-class"
      />
    );

    const header = container.querySelector('header');
    expect(header).toHaveClass('custom-class');
  });
});
