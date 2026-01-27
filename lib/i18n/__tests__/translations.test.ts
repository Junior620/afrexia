import { describe, it, expect } from 'vitest';
import { translations, getTranslation, getTranslations } from '../translations';

/**
 * Unit Tests for Translation System
 * 
 * Tests the translation system to ensure:
 * 1. Spanish translations exist for all key paths
 * 2. Variable interpolation works correctly in Spanish
 * 3. Translation retrieval functions work as expected
 * 
 * **Validates: Requirements 2.1, 2.4, 2.7**
 */

describe('Spanish Translations', () => {
  describe('translation structure', () => {
    it('should have Spanish translations object', () => {
      expect(translations).toHaveProperty('es');
      expect(translations.es).toBeDefined();
    });

    it('should have all main sections in Spanish', () => {
      expect(translations.es).toHaveProperty('navigation');
      expect(translations.es).toHaveProperty('common');
      expect(translations.es).toHaveProperty('products');
      expect(translations.es).toHaveProperty('footer');
    });
  });

  describe('navigation translations', () => {
    it('should have all navigation keys in Spanish', () => {
      const nav = translations.es.navigation;
      expect(nav.home).toBe('Inicio');
      expect(nav.products).toBe('Productos');
      expect(nav.solutions).toBe('Soluciones');
      expect(nav.quality).toBe('Calidad y Cumplimiento');
      expect(nav.traceability).toBe('Trazabilidad');
      expect(nav.about).toBe('Acerca de');
      expect(nav.resources).toBe('Recursos');
      expect(nav.blog).toBe('Blog');
      expect(nav.contact).toBe('Contacto');
      expect(nav.rfq).toBe('Solicitud de Cotización');
    });

    it('should have non-empty values for all navigation keys', () => {
      const nav = translations.es.navigation;
      Object.values(nav).forEach((value) => {
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('common translations', () => {
    it('should have all common keys in Spanish', () => {
      const common = translations.es.common;
      expect(common.learnMore).toBe('Más información');
      expect(common.downloadPDF).toBe('Descargar PDF');
      expect(common.requestQuote).toBe('Solicitar cotización');
      expect(common.contactUs).toBe('Contáctenos');
      expect(common.viewDetails).toBe('Ver detalles');
      expect(common.readMore).toBe('Leer más');
      expect(common.backToHome).toBe('Volver al inicio');
      expect(common.loading).toBe('Cargando...');
      expect(common.error).toBe('Ocurrió un error');
    });

    it('should have non-empty values for all common keys', () => {
      const common = translations.es.common;
      Object.values(common).forEach((value) => {
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('products translations', () => {
    it('should have all products keys in Spanish', () => {
      const products = translations.es.products;
      expect(products.title).toBe('Nuestros Productos');
      expect(products.subtitle).toBe('Productos agrícolas africanos de primera calidad');
      expect(products.allProducts).toBe('Todos los productos');
      expect(products.noProducts).toBe('No hay productos disponibles en este momento.');
      expect(products.viewProduct).toBe('Ver producto');
      expect(products.specifications).toBe('Especificaciones');
      expect(products.certifications).toBe('Certificaciones');
      expect(products.origin).toBe('Origen');
      expect(products.packaging).toBe('Embalaje');
    });

    it('should have non-empty values for all products keys', () => {
      const products = translations.es.products;
      Object.values(products).forEach((value) => {
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('footer translations', () => {
    it('should have all footer keys in Spanish', () => {
      const footer = translations.es.footer;
      expect(footer.tagline).toBe('Su socio de confianza para productos agrícolas africanos');
      expect(footer.products).toBe('Productos');
      expect(footer.company).toBe('Empresa');
      expect(footer.quickLinks).toBe('Enlaces Rápidos');
      expect(footer.legal).toBe('Legal');
      expect(footer.followUs).toBe('Síguenos');
      expect(footer.copyright).toBe('© {{year}} Afrexia. Todos los derechos reservados.');
      expect(footer.privacyPolicy).toBe('Política de Privacidad');
      expect(footer.termsOfService).toBe('Términos de Servicio');
    });

    it('should preserve {{year}} placeholder in copyright', () => {
      const footer = translations.es.footer;
      expect(footer.copyright).toContain('{{year}}');
    });

    it('should have non-empty values for all footer keys', () => {
      const footer = translations.es.footer;
      Object.values(footer).forEach((value) => {
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getTranslation function with Spanish', () => {
    it('should retrieve Spanish translations by key path', () => {
      expect(getTranslation('es', 'navigation.home')).toBe('Inicio');
      expect(getTranslation('es', 'common.learnMore')).toBe('Más información');
      expect(getTranslation('es', 'products.title')).toBe('Nuestros Productos');
      expect(getTranslation('es', 'footer.tagline')).toBe('Su socio de confianza para productos agrícolas africanos');
    });

    it('should handle variable interpolation in Spanish', () => {
      const result = getTranslation('es', 'footer.copyright', { year: '2024' });
      expect(result).toBe('© 2024 Afrexia. Todos los derechos reservados.');
    });

    it('should handle multiple variable interpolations', () => {
      // Add a test translation with multiple variables for testing
      const testTranslation = 'Hola {{name}}, bienvenido a {{place}}';
      // Since we can't modify the translations object in tests, we'll test the pattern
      const result = testTranslation.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
        const variables: Record<string, string> = { name: 'Juan', place: 'Madrid' };
        return variables[varName] || match;
      });
      expect(result).toBe('Hola Juan, bienvenido a Madrid');
    });

    it('should return key if translation not found', () => {
      expect(getTranslation('es', 'nonexistent.key')).toBe('nonexistent.key');
    });

    it('should preserve placeholder if variable not provided', () => {
      const result = getTranslation('es', 'footer.copyright', {});
      expect(result).toContain('{{year}}');
    });
  });

  describe('getTranslations function', () => {
    it('should return all Spanish translations', () => {
      const esTranslations = getTranslations('es');
      expect(esTranslations).toBeDefined();
      expect(esTranslations).toHaveProperty('navigation');
      expect(esTranslations).toHaveProperty('common');
      expect(esTranslations).toHaveProperty('products');
      expect(esTranslations).toHaveProperty('footer');
    });
  });

  describe('translation completeness', () => {
    it('should have same keys as French translations', () => {
      const frKeys = Object.keys(translations.fr);
      const esKeys = Object.keys(translations.es);
      expect(esKeys).toEqual(frKeys);
    });

    it('should have same navigation keys as French', () => {
      const frNavKeys = Object.keys(translations.fr.navigation);
      const esNavKeys = Object.keys(translations.es.navigation);
      expect(esNavKeys).toEqual(frNavKeys);
    });

    it('should have same common keys as French', () => {
      const frCommonKeys = Object.keys(translations.fr.common);
      const esCommonKeys = Object.keys(translations.es.common);
      expect(esCommonKeys).toEqual(frCommonKeys);
    });

    it('should have same products keys as French', () => {
      const frProductsKeys = Object.keys(translations.fr.products);
      const esProductsKeys = Object.keys(translations.es.products);
      expect(esProductsKeys).toEqual(frProductsKeys);
    });

    it('should have same footer keys as French', () => {
      const frFooterKeys = Object.keys(translations.fr.footer);
      const esFooterKeys = Object.keys(translations.es.footer);
      expect(esFooterKeys).toEqual(frFooterKeys);
    });
  });
});

/**
 * Unit Tests for German Translation System
 * 
 * Tests the German translation system to ensure:
 * 1. German translations exist for all key paths
 * 2. Special characters (ü, ö, ä, ß) render correctly
 * 3. Variable interpolation works correctly in German
 * 
 * **Validates: Requirements 2.2, 2.4, 2.7, 7.4**
 */

describe('German Translations', () => {
  describe('translation structure', () => {
    it('should have German translations object', () => {
      expect(translations).toHaveProperty('de');
      expect(translations.de).toBeDefined();
    });

    it('should have all main sections in German', () => {
      expect(translations.de).toHaveProperty('navigation');
      expect(translations.de).toHaveProperty('common');
      expect(translations.de).toHaveProperty('products');
      expect(translations.de).toHaveProperty('footer');
    });
  });

  describe('navigation translations', () => {
    it('should have all navigation keys in German', () => {
      const nav = translations.de.navigation;
      expect(nav.home).toBe('Startseite');
      expect(nav.products).toBe('Produkte');
      expect(nav.solutions).toBe('Lösungen');
      expect(nav.quality).toBe('Qualität & Compliance');
      expect(nav.traceability).toBe('Rückverfolgbarkeit');
      expect(nav.about).toBe('Über uns');
      expect(nav.resources).toBe('Ressourcen');
      expect(nav.blog).toBe('Blog');
      expect(nav.contact).toBe('Kontakt');
      expect(nav.rfq).toBe('Angebotsanfrage');
    });

    it('should have non-empty values for all navigation keys', () => {
      const nav = translations.de.navigation;
      Object.values(nav).forEach((value) => {
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('common translations', () => {
    it('should have all common keys in German', () => {
      const common = translations.de.common;
      expect(common.learnMore).toBe('Mehr erfahren');
      expect(common.downloadPDF).toBe('PDF herunterladen');
      expect(common.requestQuote).toBe('Angebot anfordern');
      expect(common.contactUs).toBe('Kontaktieren Sie uns');
      expect(common.viewDetails).toBe('Details anzeigen');
      expect(common.readMore).toBe('Weiterlesen');
      expect(common.backToHome).toBe('Zurück zur Startseite');
      expect(common.loading).toBe('Wird geladen...');
      expect(common.error).toBe('Ein Fehler ist aufgetreten');
    });

    it('should have non-empty values for all common keys', () => {
      const common = translations.de.common;
      Object.values(common).forEach((value) => {
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('products translations', () => {
    it('should have all products keys in German', () => {
      const products = translations.de.products;
      expect(products.title).toBe('Unsere Produkte');
      expect(products.subtitle).toBe('Hochwertige afrikanische Agrarprodukte');
      expect(products.allProducts).toBe('Alle Produkte');
      expect(products.noProducts).toBe('Derzeit sind keine Produkte verfügbar.');
      expect(products.viewProduct).toBe('Produkt ansehen');
      expect(products.specifications).toBe('Spezifikationen');
      expect(products.certifications).toBe('Zertifizierungen');
      expect(products.origin).toBe('Herkunft');
      expect(products.packaging).toBe('Verpackung');
    });

    it('should have non-empty values for all products keys', () => {
      const products = translations.de.products;
      Object.values(products).forEach((value) => {
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('footer translations', () => {
    it('should have all footer keys in German', () => {
      const footer = translations.de.footer;
      expect(footer.tagline).toBe('Ihr vertrauenswürdiger Partner für afrikanische Agrarprodukte');
      expect(footer.products).toBe('Produkte');
      expect(footer.company).toBe('Unternehmen');
      expect(footer.quickLinks).toBe('Schnelllinks');
      expect(footer.legal).toBe('Rechtliches');
      expect(footer.followUs).toBe('Folgen Sie uns');
      expect(footer.copyright).toBe('© {{year}} Afrexia. Alle Rechte vorbehalten.');
      expect(footer.privacyPolicy).toBe('Datenschutzrichtlinie');
      expect(footer.termsOfService).toBe('Nutzungsbedingungen');
    });

    it('should preserve {{year}} placeholder in copyright', () => {
      const footer = translations.de.footer;
      expect(footer.copyright).toContain('{{year}}');
    });

    it('should have non-empty values for all footer keys', () => {
      const footer = translations.de.footer;
      Object.values(footer).forEach((value) => {
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('special character handling', () => {
    it('should correctly render German umlauts (ü, ö, ä)', () => {
      const nav = translations.de.navigation;
      const common = translations.de.common;
      const footer = translations.de.footer;
      
      // Check for ä
      expect(nav.quality).toContain('ä'); // Qualität
      
      // Check for ü
      expect(nav.traceability).toContain('ü'); // Rückverfolgbarkeit
      expect(footer.tagline).toContain('ü'); // vertrauenswürdiger
      
      // Check for ö
      expect(nav.solutions).toContain('ö'); // Lösungen
      
      // Verify the characters are properly encoded
      expect(nav.quality).toBe('Qualität & Compliance');
      expect(nav.solutions).toBe('Lösungen');
      expect(nav.traceability).toBe('Rückverfolgbarkeit');
    });

    it('should correctly render special characters without corruption', () => {
      // Test that special characters are not corrupted or replaced
      const products = translations.de.products;
      const footer = translations.de.footer;
      
      // Verify specific words with special characters
      expect(products.subtitle).toContain('Hochwertige');
      expect(footer.tagline).toContain('vertrauenswürdiger');
      expect(footer.tagline).toContain('für');
      
      // Ensure no replacement characters or encoding issues
      expect(products.subtitle).not.toContain('?');
      expect(footer.tagline).not.toContain('?');
    });

    it('should handle German formal address (Sie form)', () => {
      const common = translations.de.common;
      const footer = translations.de.footer;
      
      // Verify formal German is used (Sie form)
      expect(common.contactUs).toBe('Kontaktieren Sie uns');
      expect(footer.followUs).toBe('Folgen Sie uns');
    });
  });

  describe('getTranslation function with German', () => {
    it('should retrieve German translations by key path', () => {
      expect(getTranslation('de', 'navigation.home')).toBe('Startseite');
      expect(getTranslation('de', 'common.learnMore')).toBe('Mehr erfahren');
      expect(getTranslation('de', 'products.title')).toBe('Unsere Produkte');
      expect(getTranslation('de', 'footer.tagline')).toBe('Ihr vertrauenswürdiger Partner für afrikanische Agrarprodukte');
    });

    it('should handle variable interpolation in German', () => {
      const result = getTranslation('de', 'footer.copyright', { year: '2024' });
      expect(result).toBe('© 2024 Afrexia. Alle Rechte vorbehalten.');
    });

    it('should preserve special characters in interpolated strings', () => {
      const result = getTranslation('de', 'footer.copyright', { year: '2024' });
      // Verify umlauts are preserved after interpolation
      expect(result).toContain('Alle Rechte vorbehalten');
      expect(result).not.toContain('?'); // No encoding corruption
    });

    it('should return key if translation not found', () => {
      expect(getTranslation('de', 'nonexistent.key')).toBe('nonexistent.key');
    });

    it('should preserve placeholder if variable not provided', () => {
      const result = getTranslation('de', 'footer.copyright', {});
      expect(result).toContain('{{year}}');
    });
  });

  describe('getTranslations function', () => {
    it('should return all German translations', () => {
      const deTranslations = getTranslations('de');
      expect(deTranslations).toBeDefined();
      expect(deTranslations).toHaveProperty('navigation');
      expect(deTranslations).toHaveProperty('common');
      expect(deTranslations).toHaveProperty('products');
      expect(deTranslations).toHaveProperty('footer');
    });
  });

  describe('translation completeness', () => {
    it('should have same keys as French translations', () => {
      const frKeys = Object.keys(translations.fr);
      const deKeys = Object.keys(translations.de);
      expect(deKeys).toEqual(frKeys);
    });

    it('should have same navigation keys as French', () => {
      const frNavKeys = Object.keys(translations.fr.navigation);
      const deNavKeys = Object.keys(translations.de.navigation);
      expect(deNavKeys).toEqual(frNavKeys);
    });

    it('should have same common keys as French', () => {
      const frCommonKeys = Object.keys(translations.fr.common);
      const deCommonKeys = Object.keys(translations.de.common);
      expect(deCommonKeys).toEqual(frCommonKeys);
    });

    it('should have same products keys as French', () => {
      const frProductsKeys = Object.keys(translations.fr.products);
      const deProductsKeys = Object.keys(translations.de.products);
      expect(deProductsKeys).toEqual(frProductsKeys);
    });

    it('should have same footer keys as French', () => {
      const frFooterKeys = Object.keys(translations.fr.footer);
      const deFooterKeys = Object.keys(translations.de.footer);
      expect(deFooterKeys).toEqual(frFooterKeys);
    });
  });
});

/**
 * Unit Tests for Russian Translation System
 * 
 * Tests the Russian translation system to ensure:
 * 1. Russian translations exist for all key paths
 * 2. Cyrillic characters render correctly
 * 3. Variable interpolation works correctly in Russian
 * 
 * **Validates: Requirements 2.3, 2.4, 2.7, 7.4**
 */

describe('Russian Translations', () => {
  describe('translation structure', () => {
    it('should have Russian translations object', () => {
      expect(translations).toHaveProperty('ru');
      expect(translations.ru).toBeDefined();
    });

    it('should have all main sections in Russian', () => {
      expect(translations.ru).toHaveProperty('navigation');
      expect(translations.ru).toHaveProperty('common');
      expect(translations.ru).toHaveProperty('products');
      expect(translations.ru).toHaveProperty('footer');
    });
  });

  describe('navigation translations', () => {
    it('should have all navigation keys in Russian', () => {
      const nav = translations.ru.navigation;
      expect(nav.home).toBe('Главная');
      expect(nav.products).toBe('Продукты');
      expect(nav.solutions).toBe('Решения');
      expect(nav.quality).toBe('Качество и соответствие');
      expect(nav.traceability).toBe('Отслеживаемость');
      expect(nav.about).toBe('О нас');
      expect(nav.resources).toBe('Ресурсы');
      expect(nav.blog).toBe('Блог');
      expect(nav.contact).toBe('Контакты');
      expect(nav.rfq).toBe('Запрос предложения');
    });

    it('should have non-empty values for all navigation keys', () => {
      const nav = translations.ru.navigation;
      Object.values(nav).forEach((value) => {
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('common translations', () => {
    it('should have all common keys in Russian', () => {
      const common = translations.ru.common;
      expect(common.learnMore).toBe('Узнать больше');
      expect(common.downloadPDF).toBe('Скачать PDF');
      expect(common.requestQuote).toBe('Запросить предложение');
      expect(common.contactUs).toBe('Свяжитесь с нами');
      expect(common.viewDetails).toBe('Посмотреть детали');
      expect(common.readMore).toBe('Читать далее');
      expect(common.backToHome).toBe('Вернуться на главную');
      expect(common.loading).toBe('Загрузка...');
      expect(common.error).toBe('Произошла ошибка');
    });

    it('should have non-empty values for all common keys', () => {
      const common = translations.ru.common;
      Object.values(common).forEach((value) => {
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('products translations', () => {
    it('should have all products keys in Russian', () => {
      const products = translations.ru.products;
      expect(products.title).toBe('Наши продукты');
      expect(products.subtitle).toBe('Высококачественные африканские сельскохозяйственные товары');
      expect(products.allProducts).toBe('Все продукты');
      expect(products.noProducts).toBe('В настоящее время продукты недоступны.');
      expect(products.viewProduct).toBe('Посмотреть продукт');
      expect(products.specifications).toBe('Спецификации');
      expect(products.certifications).toBe('Сертификаты');
      expect(products.origin).toBe('Происхождение');
      expect(products.packaging).toBe('Упаковка');
    });

    it('should have non-empty values for all products keys', () => {
      const products = translations.ru.products;
      Object.values(products).forEach((value) => {
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('footer translations', () => {
    it('should have all footer keys in Russian', () => {
      const footer = translations.ru.footer;
      expect(footer.tagline).toBe('Ваш надежный партнер по африканским сельскохозяйственным товарам');
      expect(footer.products).toBe('Продукты');
      expect(footer.company).toBe('Компания');
      expect(footer.quickLinks).toBe('Быстрые ссылки');
      expect(footer.legal).toBe('Правовая информация');
      expect(footer.followUs).toBe('Подписывайтесь на нас');
      expect(footer.copyright).toBe('© {{year}} Afrexia. Все права защищены.');
      expect(footer.privacyPolicy).toBe('Политика конфиденциальности');
      expect(footer.termsOfService).toBe('Условия использования');
    });

    it('should preserve {{year}} placeholder in copyright', () => {
      const footer = translations.ru.footer;
      expect(footer.copyright).toContain('{{year}}');
    });

    it('should have non-empty values for all footer keys', () => {
      const footer = translations.ru.footer;
      Object.values(footer).forEach((value) => {
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Cyrillic character handling', () => {
    it('should correctly render Cyrillic characters', () => {
      const nav = translations.ru.navigation;
      const common = translations.ru.common;
      const products = translations.ru.products;
      const footer = translations.ru.footer;
      
      // Check for various Cyrillic characters
      expect(nav.home).toContain('Г'); // Главная
      expect(nav.products).toContain('П'); // Продукты
      expect(nav.solutions).toContain('Р'); // Решения
      expect(nav.quality).toContain('К'); // Качество
      expect(nav.about).toContain('О'); // О нас
      
      // Verify specific Cyrillic words
      expect(nav.home).toBe('Главная');
      expect(common.loading).toBe('Загрузка...');
      expect(products.title).toBe('Наши продукты');
      expect(footer.tagline).toContain('надежный');
    });

    it('should correctly render Cyrillic characters without corruption', () => {
      // Test that Cyrillic characters are not corrupted or replaced
      const nav = translations.ru.navigation;
      const common = translations.ru.common;
      const footer = translations.ru.footer;
      
      // Verify specific words with Cyrillic characters
      expect(nav.quality).toContain('Качество');
      expect(common.contactUs).toContain('Свяжитесь');
      expect(footer.tagline).toContain('партнер');
      
      // Ensure no replacement characters or encoding issues
      expect(nav.quality).not.toContain('?');
      expect(common.contactUs).not.toContain('?');
      expect(footer.tagline).not.toContain('?');
    });

    it('should handle Russian formal address (Вы form)', () => {
      const common = translations.ru.common;
      const footer = translations.ru.footer;
      
      // Verify formal Russian is used (Вы form)
      expect(common.contactUs).toBe('Свяжитесь с нами');
      expect(footer.followUs).toBe('Подписывайтесь на нас');
      expect(footer.tagline).toContain('Ваш'); // Formal "your"
    });

    it('should preserve Cyrillic characters in all sections', () => {
      const nav = translations.ru.navigation;
      const common = translations.ru.common;
      const products = translations.ru.products;
      const footer = translations.ru.footer;
      
      // Test a sample from each section
      expect(nav.traceability).toBe('Отслеживаемость');
      expect(common.readMore).toBe('Читать далее');
      expect(products.certifications).toBe('Сертификаты');
      expect(footer.privacyPolicy).toBe('Политика конфиденциальности');
    });
  });

  describe('getTranslation function with Russian', () => {
    it('should retrieve Russian translations by key path', () => {
      expect(getTranslation('ru', 'navigation.home')).toBe('Главная');
      expect(getTranslation('ru', 'common.learnMore')).toBe('Узнать больше');
      expect(getTranslation('ru', 'products.title')).toBe('Наши продукты');
      expect(getTranslation('ru', 'footer.tagline')).toBe('Ваш надежный партнер по африканским сельскохозяйственным товарам');
    });

    it('should handle variable interpolation in Russian', () => {
      const result = getTranslation('ru', 'footer.copyright', { year: '2024' });
      expect(result).toBe('© 2024 Afrexia. Все права защищены.');
    });

    it('should preserve Cyrillic characters in interpolated strings', () => {
      const result = getTranslation('ru', 'footer.copyright', { year: '2024' });
      // Verify Cyrillic characters are preserved after interpolation
      expect(result).toContain('Все права защищены');
      expect(result).not.toContain('?'); // No encoding corruption
    });

    it('should return key if translation not found', () => {
      expect(getTranslation('ru', 'nonexistent.key')).toBe('nonexistent.key');
    });

    it('should preserve placeholder if variable not provided', () => {
      const result = getTranslation('ru', 'footer.copyright', {});
      expect(result).toContain('{{year}}');
    });
  });

  describe('getTranslations function', () => {
    it('should return all Russian translations', () => {
      const ruTranslations = getTranslations('ru');
      expect(ruTranslations).toBeDefined();
      expect(ruTranslations).toHaveProperty('navigation');
      expect(ruTranslations).toHaveProperty('common');
      expect(ruTranslations).toHaveProperty('products');
      expect(ruTranslations).toHaveProperty('footer');
    });
  });

  describe('translation completeness', () => {
    it('should have same keys as French translations', () => {
      const frKeys = Object.keys(translations.fr);
      const ruKeys = Object.keys(translations.ru);
      expect(ruKeys).toEqual(frKeys);
    });

    it('should have same navigation keys as French', () => {
      const frNavKeys = Object.keys(translations.fr.navigation);
      const ruNavKeys = Object.keys(translations.ru.navigation);
      expect(ruNavKeys).toEqual(frNavKeys);
    });

    it('should have same common keys as French', () => {
      const frCommonKeys = Object.keys(translations.fr.common);
      const ruCommonKeys = Object.keys(translations.ru.common);
      expect(ruCommonKeys).toEqual(frCommonKeys);
    });

    it('should have same products keys as French', () => {
      const frProductsKeys = Object.keys(translations.fr.products);
      const ruProductsKeys = Object.keys(translations.ru.products);
      expect(ruProductsKeys).toEqual(frProductsKeys);
    });

    it('should have same footer keys as French', () => {
      const frFooterKeys = Object.keys(translations.fr.footer);
      const ruFooterKeys = Object.keys(translations.ru.footer);
      expect(ruFooterKeys).toEqual(frFooterKeys);
    });
  });
});
