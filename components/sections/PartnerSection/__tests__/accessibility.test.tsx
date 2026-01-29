/**
 * Accessibility Tests for PartnerSection
 * 
 * Validates that the PartnerSection component meets accessibility requirements:
 * - Semantic HTML structure
 * - ARIA attributes
 * - Keyboard navigation
 * - Focus states
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.6
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PartnerSection } from '../index';
import { partnerSectionContent } from '@/lib/content/partner-section';

describe('PartnerSection Accessibility', () => {
  describe('Semantic HTML (Requirement 11.1)', () => {
    it('uses semantic section element', () => {
      render(<PartnerSection locale="en" />);
      const section = screen.getByTestId('partner-section');
      expect(section.tagName).toBe('SECTION');
    });

    it('uses semantic article element for editorial content', () => {
      render(<PartnerSection locale="en" />);
      const article = screen.getByTestId('editorial-content');
      expect(article.tagName).toBe('ARTICLE');
    });

    it('uses semantic nav element for CTA row', () => {
      render(<PartnerSection locale="en" />);
      const nav = screen.getByTestId('cta-row');
      expect(nav.tagName).toBe('NAV');
    });

    it('uses semantic figure element for photo stack', () => {
      render(<PartnerSection locale="en" />);
      const figure = screen.getByTestId('photo-stack');
      expect(figure.getAttribute('role')).toBe('figure');
    });

    it('uses proper heading hierarchy with H2', () => {
      render(<PartnerSection locale="en" />);
      const title = screen.getByTestId('title');
      expect(title.tagName).toBe('H2');
    });
  });

  describe('ARIA Attributes (Requirement 11.2, 11.6)', () => {
    it('section has aria-labelledby pointing to title', () => {
      render(<PartnerSection locale="en" />);
      const section = screen.getByTestId('partner-section');
      expect(section.getAttribute('aria-labelledby')).toBe('partner-section-title');
    });

    it('title has matching id for aria-labelledby', () => {
      render(<PartnerSection locale="en" />);
      const title = screen.getByTestId('title');
      expect(title.id).toBe('partner-section-title');
    });

    it('external links have aria-label indicating new tab', () => {
      render(<PartnerSection locale="en" />);
      const content = partnerSectionContent.en;
      
      if (content.primaryCTA.external) {
        const primaryLink = screen.getByRole('link', { name: new RegExp(content.primaryCTA.label) });
        expect(primaryLink.getAttribute('aria-label')).toContain('opens in new tab');
      }
    });

    it('photo stack has aria-label with caption', () => {
      render(<PartnerSection locale="en" />);
      const photoStack = screen.getByTestId('photo-stack');
      const content = partnerSectionContent.en;
      expect(photoStack.getAttribute('aria-label')).toBe(content.photoCaption);
    });

    it('eyebrow has aria-label for context', () => {
      render(<PartnerSection locale="en" />);
      const eyebrow = screen.getByTestId('eyebrow');
      expect(eyebrow.getAttribute('aria-label')).toBe('Partner category');
    });

    it('body text has aria-label for region', () => {
      render(<PartnerSection locale="en" />);
      const bodyText = screen.getByTestId('body-text');
      expect(bodyText.getAttribute('aria-label')).toBe('Partner description');
    });

    it('key facts list has aria-label', () => {
      render(<PartnerSection locale="en" />);
      const keyFacts = screen.getByTestId('key-facts');
      expect(keyFacts.getAttribute('aria-label')).toBe('Key capabilities');
    });

    it('CTA row has aria-label', () => {
      render(<PartnerSection locale="en" />);
      const ctaRow = screen.getByTestId('cta-row');
      expect(ctaRow.getAttribute('aria-label')).toBe('Partner actions');
    });

    it('trust microcopy has aria-label', () => {
      render(<PartnerSection locale="en" />);
      const trustMicrocopy = screen.getByTestId('trust-microcopy');
      expect(trustMicrocopy.getAttribute('aria-label')).toBe('Trust indicators');
    });

    it('stat cards have aria-label with value and label', () => {
      const content = partnerSectionContent.en;
      if (content.stats && content.stats.length > 0) {
        render(<PartnerSection locale="en" />);
        const statCards = screen.getAllByTestId('stat-card');
        
        statCards.forEach((card, index) => {
          const stat = content.stats![index];
          expect(card.getAttribute('aria-label')).toBe(`${stat.label}: ${stat.value}`);
        });
      }
    });
  });

  describe('Keyboard Navigation (Requirement 11.3, 11.4)', () => {
    it('all CTA buttons are keyboard accessible', () => {
      render(<PartnerSection locale="en" />);
      const content = partnerSectionContent.en;
      
      const primaryCTA = screen.getByRole('link', { name: new RegExp(content.primaryCTA.label) });
      const secondaryCTA = screen.getByRole('link', { name: new RegExp(content.secondaryCTA.label) });
      
      // Links should be focusable (no tabindex=-1)
      expect(primaryCTA.getAttribute('tabindex')).not.toBe('-1');
      expect(secondaryCTA.getAttribute('tabindex')).not.toBe('-1');
    });

    it('photo stack is keyboard focusable', () => {
      render(<PartnerSection locale="en" />);
      const photoStack = screen.getByTestId('photo-stack');
      
      // Should have tabIndex=0 to be keyboard accessible
      expect(photoStack.getAttribute('tabindex')).toBe('0');
    });

    it('CTA buttons have focus-visible styles', () => {
      render(<PartnerSection locale="en" />);
      const content = partnerSectionContent.en;
      
      const primaryCTA = screen.getByRole('link', { name: new RegExp(content.primaryCTA.label) });
      
      // Check for focus-visible classes in className
      expect(primaryCTA.className).toContain('focus-visible:ring');
      expect(primaryCTA.className).toContain('focus:outline-none');
    });
  });

  describe('Image Alt Text (Requirement 11.2)', () => {
    it('all images have descriptive alt text', () => {
      render(<PartnerSection locale="en" />);
      const content = partnerSectionContent.en;
      
      // Check that content has alt text defined
      content.images.forEach((image) => {
        expect(image.alt).toBeTruthy();
        expect(image.alt.length).toBeGreaterThan(0);
      });
    });
  });

  describe('External Link Security (Requirement 1.5, 5.4)', () => {
    it('external links have rel="noopener noreferrer"', () => {
      render(<PartnerSection locale="en" />);
      const content = partnerSectionContent.en;
      
      if (content.primaryCTA.external) {
        const primaryLink = screen.getByRole('link', { name: new RegExp(content.primaryCTA.label) });
        expect(primaryLink.getAttribute('rel')).toBe('noopener noreferrer');
        expect(primaryLink.getAttribute('target')).toBe('_blank');
      }
    });
  });

  describe('Proper Heading Hierarchy', () => {
    it('uses H2 for main title', () => {
      render(<PartnerSection locale="en" />);
      const title = screen.getByTestId('title');
      expect(title.tagName).toBe('H2');
    });

    it('title has proper id for linking', () => {
      render(<PartnerSection locale="en" />);
      const title = screen.getByTestId('title');
      expect(title.id).toBe('partner-section-title');
    });
  });
});
