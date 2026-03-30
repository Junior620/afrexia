/**
 * Unit tests for ISR Configuration
 */

import {
  ISR_REVALIDATION,
  getRevalidationTime,
  getPageTypeFromPath,
  getRevalidationFromPath,
} from '../isrConfig';

describe('ISR Configuration', () => {
  describe('ISR_REVALIDATION constants', () => {
    it('should have correct revalidation time for price pages (24 hours)', () => {
      expect(ISR_REVALIDATION.PRICE_PAGES).toBe(86400);
    });

    it('should have correct revalidation time for product country pages (7 days)', () => {
      expect(ISR_REVALIDATION.PRODUCT_COUNTRY_PAGES).toBe(604800);
    });

    it('should have correct revalidation time for comparison pages (7 days)', () => {
      expect(ISR_REVALIDATION.COMPARISON_PAGES).toBe(604800);
    });

    it('should have correct revalidation time for certification pages (7 days)', () => {
      expect(ISR_REVALIDATION.CERTIFICATION_PAGES).toBe(604800);
    });

    it('should have correct revalidation time for port pages (7 days)', () => {
      expect(ISR_REVALIDATION.PORT_PAGES).toBe(604800);
    });

    it('should have correct revalidation time for season pages (1 year)', () => {
      expect(ISR_REVALIDATION.SEASON_PAGES).toBe(31536000);
    });

    it('should have correct revalidation time for incoterm pages (7 days)', () => {
      expect(ISR_REVALIDATION.INCOTERM_PAGES).toBe(604800);
    });

    it('should have correct revalidation time for container pages (7 days)', () => {
      expect(ISR_REVALIDATION.CONTAINER_PAGES).toBe(604800);
    });
  });

  describe('getRevalidationTime', () => {
    it('should return correct revalidation time for given page type', () => {
      expect(getRevalidationTime('PRICE_PAGES')).toBe(86400);
      expect(getRevalidationTime('PRODUCT_COUNTRY_PAGES')).toBe(604800);
      expect(getRevalidationTime('SEASON_PAGES')).toBe(31536000);
    });
  });

  describe('getPageTypeFromPath', () => {
    describe('Price pages', () => {
      it('should identify French price page', () => {
        expect(getPageTypeFromPath('/fr/prix/cacao-cameroun')).toBe('PRICE_PAGES');
      });

      it('should identify English price page', () => {
        expect(getPageTypeFromPath('/en/prix/coffee-cameroon')).toBe('PRICE_PAGES');
      });

      it('should identify Spanish price page', () => {
        expect(getPageTypeFromPath('/es/prix/cacao-camerun')).toBe('PRICE_PAGES');
      });
    });

    describe('Product × Country pages', () => {
      it('should identify French product country page', () => {
        expect(getPageTypeFromPath('/fr/produits/cacao/export-pays-bas')).toBe(
          'PRODUCT_COUNTRY_PAGES'
        );
      });

      it('should identify English product country page', () => {
        expect(getPageTypeFromPath('/en/produits/cocoa/export-netherlands')).toBe(
          'PRODUCT_COUNTRY_PAGES'
        );
      });

      it('should not match regular product pages', () => {
        expect(getPageTypeFromPath('/fr/produits/cacao')).not.toBe('PRODUCT_COUNTRY_PAGES');
      });
    });

    describe('Comparison pages', () => {
      it('should identify comparison page', () => {
        expect(getPageTypeFromPath('/fr/guide/cacao-vs-cafe')).toBe('COMPARISON_PAGES');
      });

      it('should identify origin comparison page', () => {
        expect(getPageTypeFromPath('/en/guide/cocoa-cameroon-vs-ivory-coast')).toBe(
          'COMPARISON_PAGES'
        );
      });
    });

    describe('Certification pages', () => {
      it('should identify certification page', () => {
        expect(getPageTypeFromPath('/fr/certifications/rainforest-alliance-cacao')).toBe(
          'CERTIFICATION_PAGES'
        );
      });

      it('should identify English certification page', () => {
        expect(getPageTypeFromPath('/en/certifications/fair-trade-coffee')).toBe(
          'CERTIFICATION_PAGES'
        );
      });
    });

    describe('Port pages', () => {
      it('should identify port page', () => {
        expect(getPageTypeFromPath('/fr/logistique/export-cacao-port-rotterdam')).toBe(
          'PORT_PAGES'
        );
      });

      it('should identify English port page', () => {
        expect(getPageTypeFromPath('/en/logistique/export-coffee-port-hamburg')).toBe(
          'PORT_PAGES'
        );
      });
    });

    describe('Season pages', () => {
      it('should identify harvest season page', () => {
        expect(getPageTypeFromPath('/fr/recolte/cacao-cameroun-saison-2024')).toBe(
          'SEASON_PAGES'
        );
      });

      it('should identify calendar page', () => {
        expect(getPageTypeFromPath('/fr/calendrier-recolte/cacao-afrique-ouest')).toBe(
          'SEASON_PAGES'
        );
      });

      it('should identify English calendar page', () => {
        expect(getPageTypeFromPath('/en/calendrier-recolte/coffee-west-africa')).toBe(
          'SEASON_PAGES'
        );
      });
    });

    describe('Incoterm pages', () => {
      it('should identify incoterm page', () => {
        expect(getPageTypeFromPath('/fr/incoterms/cacao-fob-rotterdam')).toBe(
          'INCOTERM_PAGES'
        );
      });

      it('should identify English incoterm page', () => {
        expect(getPageTypeFromPath('/en/incoterms/coffee-cif-hamburg')).toBe(
          'INCOTERM_PAGES'
        );
      });
    });

    describe('Container pages', () => {
      it('should identify container page', () => {
        expect(getPageTypeFromPath('/fr/commande/cacao-container-20ft')).toBe(
          'CONTAINER_PAGES'
        );
      });

      it('should identify English container page', () => {
        expect(getPageTypeFromPath('/en/commande/coffee-container-40ft')).toBe(
          'CONTAINER_PAGES'
        );
      });
    });

    describe('Non-programmatic pages', () => {
      it('should return null for homepage', () => {
        expect(getPageTypeFromPath('/fr')).toBeNull();
      });

      it('should return null for regular product page', () => {
        expect(getPageTypeFromPath('/fr/produits/cacao')).toBeNull();
      });

      it('should return null for about page', () => {
        expect(getPageTypeFromPath('/fr/about')).toBeNull();
      });

      it('should return null for contact page', () => {
        expect(getPageTypeFromPath('/en/contact')).toBeNull();
      });
    });
  });

  describe('getRevalidationFromPath', () => {
    it('should return correct revalidation time for price page', () => {
      expect(getRevalidationFromPath('/fr/prix/cacao-cameroun')).toBe(86400);
    });

    it('should return correct revalidation time for product country page', () => {
      expect(getRevalidationFromPath('/fr/produits/cacao/export-pays-bas')).toBe(604800);
    });

    it('should return correct revalidation time for season page', () => {
      expect(getRevalidationFromPath('/fr/recolte/cacao-cameroun-saison-2024')).toBe(
        31536000
      );
    });

    it('should return undefined for non-programmatic page', () => {
      expect(getRevalidationFromPath('/fr/about')).toBeUndefined();
    });

    it('should return undefined for homepage', () => {
      expect(getRevalidationFromPath('/fr')).toBeUndefined();
    });
  });
});
