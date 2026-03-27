const cheerio = require('cheerio');

async function testCoffeeScraping() {
  try {
    console.log('🚀 Démarrage du test de scraping ONCC...\n');
    
    const response = await fetch('https://www.oncc.cm/prices', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (!response.ok) {
      throw new Error(`ONCC returned status ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const extractPrice = (selector, productName) => {
      const element = $(selector);
      if (!element.length) {
        throw new Error(`Element not found for ${productName}`);
      }
      const priceText = element.text().trim();
      const priceMatch = priceText.match(/[\d\s,]+/);
      if (!priceMatch) {
        throw new Error(`No price match found for ${productName}: ${priceText}`);
      }
      const price = parseInt(priceMatch[0].replace(/[\s,]/g, ''), 10);
      
      return { product: productName, price, unit: 'FCFA/KG FOB ONCC' };
    };
    
    const arabicaPrice = extractPrice(
      'body > main > div > div:nth-child(5) > div > div > section:nth-child(2) > section > section:nth-child(2) > span:first-child',
      'Café Arabica'
    );
    
    const robustaPrice = extractPrice(
      'body > main > div > div:nth-child(6) > div > div > section:nth-child(2) > section > section:nth-child(2) > span:first-child',
      'Café Robusta'
    );
    
    console.log('✅ SUCCÈS - Prix extraits avec succès!');
    console.log(`Arabica: ${arabicaPrice.price} FCFA/KG`);
    console.log(`Robusta: ${robustaPrice.price} FCFA/KG`);
  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    process.exit(1);
  }
}

testCoffeeScraping();
