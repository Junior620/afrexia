const { chromium } = require('playwright');

async function testCocoaScraping() {
  let browser;
  
  try {
    console.log('🚀 Démarrage du test de scraping ICE...\n');
    
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    });
    
    const page = await context.newPage();
    
    console.log('📡 Navigation vers ICE London...');
    await page.goto(
      'https://www.ice.com/products/37089076/London-Cocoa-Futures/data?marketId=7758984',
      { waitUntil: 'domcontentloaded', timeout: 60000 }
    );
    
    // Attendre que la page charge les données dynamiques
    console.log('⏳ Attente du chargement des données...');
    await page.waitForTimeout(5000);
    
    console.log('⏳ Attente de la table...');
    await page.waitForSelector('table tbody tr td', { timeout: 20000 });
    
    console.log('🔍 Extraction du prix...');
    const priceElement = page.locator(
      'xpath=/html/body/div[1]/div/main/div/div/div/div/div/div[4]/div/div/div[1]/table/tbody[1]/tr[1]/td[2]'
    ).first();
    
    const priceText = await priceElement.textContent();
    
    if (!priceText) {
      throw new Error('Price element found but no text content');
    }
    
    const priceMatch = priceText.trim().match(/[\d,]+\.?\d*/);
    if (!priceMatch) {
      throw new Error(`No price found in text: ${priceText}`);
    }
    
    const price = parseFloat(priceMatch[0].replace(/,/g, ''));
    
    if (isNaN(price) || price <= 0) {
      throw new Error(`Invalid price: ${price}`);
    }
    
    console.log('✅ SUCCÈS - Prix extrait avec succès!');
    console.log(`Prix: £${price}/T (ICE London)`);
    
    await browser.close();
  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    if (browser) await browser.close();
    process.exit(1);
  }
}

testCocoaScraping();
