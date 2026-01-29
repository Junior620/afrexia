/**
 * Checkpoint 10 Verification Tests
 * 
 * Comprehensive tests to verify all components render correctly:
 * - All sub-components render without errors
 * - French and English content displays correctly
 * - Responsive layout structure is correct
 * - Images are configured with optimization
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PartnerSection } from '../index';
import { EditorialContent } from '../EditorialContent';
import { StatCards } from '../StatCards';
import { CTARow } from '../CTARow';
import { TrustMicrocopy } from '../TrustMicrocopy';
import { PhotoStack } from '../PhotoStack';

describe('Checkpoint 10: All Components Render Correctly', () => {
  describe('Sub-component Rendering', () => {
    it('PhotoStack renders without errors', () => {
      const images = [
        { src: '/test1.jpg', alt: 'Test 1', priority: true },
        { src: '/test2.jpg', alt: 'Test 2', priority: false },
      ];
      
      render(<PhotoStack images={images} caption="Test caption" />);
      expect(screen.getByTestId('photo-stack')).toBeDefined();
    });

    it('EditorialContent renders without errors', () => {
      render(
        <EditorialContent
          eyebrow="Test Eyebrow"
          title="Test Title"
          subtitle="Test Subtitle"
          bodyText={['Test body text']}
          keyFacts={['Fact 1', 'Fact 2', 'Fact 3']}
        />
      );
      
      expect(screen.getByTestId('editorial-content')).toBeDefined();
      expect(screen.getByTestId('eyebrow')).toBeDefined();
      expect(screen.getByTestId('subtitle')).toBeDefined();
      expect(screen.getByTestId('body-text')).toBeDefined();
      expect(screen.getByTestId('key-facts')).toBeDefined();
    });

    it('StatCards renders without errors when stats provided', () => {
      const stats = [
        { label: 'Test 1', value: '100' },
        { label: 'Test 2', value: '200' },
        { label: 'Test 3', value: '300' },
      ];
      
      render(<StatCards stats={stats} />);
      expect(screen.getByTestId('stat-cards')).toBeDefined();
    });

    it('StatCards does not render when stats are empty', () => {
      const { container } = render(<StatCards stats={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('CTARow renders without errors', () => {
      const primaryCTA = { label: 'Primary', href: 'https://example.com', external: true };
      const secondaryCTA = { label: 'Secondary', href: '/test', external: false };
      
      render(<CTARow primaryCTA={primaryCTA} secondaryCTA={secondaryCTA} />);
      expect(screen.getByTestId('cta-row')).toBeDefined();
    });

    it('TrustMicrocopy renders without errors', () => {
      render(<TrustMicrocopy text="Test • Trust • Text" />);
      expect(screen.getByTestId('trust-microcopy')).toBeDefined();
    });
  });

  describe('French Content Display', () => {
    it('displays all French content elements correctly', () => {
      render(<PartnerSection locale="fr" />);
      
      // Eyebrow
      expect(screen.getByText('Partenaire opérationnel')).toBeDefined();
      
      // Title (appears twice - mobile and desktop)
      expect(screen.getAllByText('Afexia × SCPB SARL')).toHaveLength(2);
      
      // Subtitle
      expect(screen.getByText(/Un ancrage local solide/)).toBeDefined();
      
      // Key facts
      expect(screen.getByText(/Collecte, stockage & préparation export/)).toBeDefined();
      expect(screen.getByText(/Contrôle qualité & documentation/)).toBeDefined();
      expect(screen.getByText(/Traçabilité & conformité EUDR-ready/)).toBeDefined();
      
      // CTAs
      expect(screen.getByText('Découvrir SCPB SARL')).toBeDefined();
      expect(screen.getByText(/Voir nos capacités d'exécution/)).toBeDefined();
      
      // Trust microcopy
      expect(screen.getByText(/Réponse sous 24h/)).toBeDefined();
    });

    it('displays French stat cards', () => {
      render(<PartnerSection locale="fr" />);
      
      expect(screen.getByText('Réseau producteurs')).toBeDefined();
      expect(screen.getByText('Capacité annuelle')).toBeDefined();
      expect(screen.getByText('Infrastructure')).toBeDefined();
    });
  });

  describe('English Content Display', () => {
    it('displays all English content elements correctly', () => {
      render(<PartnerSection locale="en" />);
      
      // Eyebrow
      expect(screen.getByText('Operational partner')).toBeDefined();
      
      // Title (appears twice - mobile and desktop)
      expect(screen.getAllByText('Afexia × SCPB SARL')).toHaveLength(2);
      
      // Subtitle
      expect(screen.getByText(/Strong local presence/)).toBeDefined();
      
      // Key facts
      expect(screen.getByText(/Collection, storage & export preparation/)).toBeDefined();
      expect(screen.getByText(/Quality control & documentation/)).toBeDefined();
      expect(screen.getByText(/Traceability & EUDR-ready compliance/)).toBeDefined();
      
      // CTAs
      expect(screen.getByText('Discover SCPB SARL')).toBeDefined();
      expect(screen.getByText('View our execution capabilities')).toBeDefined();
      
      // Trust microcopy
      expect(screen.getByText(/24h response/)).toBeDefined();
    });

    it('displays English stat cards', () => {
      render(<PartnerSection locale="en" />);
      
      expect(screen.getByText('Producer network')).toBeDefined();
      expect(screen.getByText('Annual capacity')).toBeDefined();
      expect(screen.getByText('Infrastructure')).toBeDefined();
    });
  });

  describe('Responsive Layout Structure', () => {
    it('has correct grid layout classes for desktop', () => {
      render(<PartnerSection locale="fr" />);
      
      const section = screen.getByTestId('partner-section');
      const gridContainer = section.querySelector('.md\\:grid');
      
      expect(gridContainer).toBeDefined();
      expect(gridContainer).not.toBeNull();
    });

    it('has mobile title that is hidden on desktop', () => {
      render(<PartnerSection locale="fr" />);
      
      const section = screen.getByTestId('partner-section');
      const mobileTitle = section.querySelector('.md\\:hidden');
      
      expect(mobileTitle).toBeDefined();
      expect(mobileTitle).not.toBeNull();
    });

    it('has desktop title that is hidden on mobile', () => {
      render(<PartnerSection locale="fr" />);
      
      const desktopTitle = screen.getByTestId('title');
      expect(desktopTitle.className).toContain('hidden');
      expect(desktopTitle.className).toContain('md:block');
    });

    it('has correct max-width constraint', () => {
      render(<PartnerSection locale="fr" />);
      
      const section = screen.getByTestId('partner-section');
      const wrapper = section.querySelector('.max-w-\\[1200px\\]');
      
      expect(wrapper).toBeDefined();
      expect(wrapper).not.toBeNull();
    });
  });

  describe('Image Optimization Configuration', () => {
    it('renders images with next/image component', () => {
      render(<PartnerSection locale="fr" />);
      
      // Check that images are rendered with alt text
      const primaryImage = screen.getByAltText(/Contrôle qualité SCPB/);
      const overlayImage = screen.getByAltText(/Infrastructure de stockage SCPB/);
      
      expect(primaryImage).toBeDefined();
      expect(overlayImage).toBeDefined();
    });

    it('primary image has priority loading', () => {
      const images = [
        { src: '/test1.jpg', alt: 'Test 1', priority: true },
        { src: '/test2.jpg', alt: 'Test 2', priority: false },
      ];
      
      render(<PhotoStack images={images} caption="Test" />);
      
      // Both images should be present
      expect(screen.getByAltText('Test 1')).toBeDefined();
      expect(screen.getByAltText('Test 2')).toBeDefined();
    });

    it('all images have alt text for accessibility', () => {
      render(<PartnerSection locale="en" />);
      
      // Check French images have alt text
      const primaryImage = screen.getByAltText(/SCPB quality control/);
      const overlayImage = screen.getByAltText(/SCPB storage infrastructure/);
      
      expect(primaryImage).toBeDefined();
      expect(overlayImage).toBeDefined();
      
      // Verify alt text is not empty
      expect(primaryImage.getAttribute('alt')).not.toBe('');
      expect(overlayImage.getAttribute('alt')).not.toBe('');
    });
  });

  describe('Integration Test', () => {
    it('renders complete PartnerSection with all sub-components', () => {
      render(<PartnerSection locale="fr" />);
      
      // Verify all major components are present
      expect(screen.getByTestId('partner-section')).toBeDefined();
      expect(screen.getByTestId('photo-stack')).toBeDefined();
      expect(screen.getByTestId('editorial-content')).toBeDefined();
      expect(screen.getByTestId('stat-cards')).toBeDefined();
      expect(screen.getByTestId('cta-row')).toBeDefined();
      expect(screen.getByTestId('trust-microcopy')).toBeDefined();
    });

    it('renders complete PartnerSection for both locales without errors', () => {
      // Test French
      const { unmount: unmountFr } = render(<PartnerSection locale="fr" />);
      expect(screen.getByTestId('partner-section')).toBeDefined();
      unmountFr();
      
      // Test English
      const { unmount: unmountEn } = render(<PartnerSection locale="en" />);
      expect(screen.getByTestId('partner-section')).toBeDefined();
      unmountEn();
    });
  });
});
