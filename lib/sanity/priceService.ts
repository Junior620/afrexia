import { client, writeClient } from '@/sanity/lib/client';

interface PriceData {
  product: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  source: string;
}

export class PriceServiceServer {
  /**
   * Récupère tous les prix depuis Sanity
   */
  static async getPrices(): Promise<PriceData[]> {
    const query = `*[_type == "commodityPrice"] | order(product asc) {
      product,
      price,
      unit,
      trend,
      change,
      source,
      lastUpdated
    }`;

    return await client.fetch(query);
  }

  /**
   * Met à jour ou crée les prix dans Sanity
   */
  static async updatePrices(prices: PriceData[]): Promise<void> {
    for (const priceData of prices) {
      // Chercher si le produit existe déjà
      const existing = await client.fetch(
        `*[_type == "commodityPrice" && product == $product][0]`,
        { product: priceData.product }
      );

      if (existing) {
        // Mettre à jour
        await writeClient
          .patch(existing._id)
          .set({
            price: priceData.price,
            unit: priceData.unit,
            trend: priceData.trend,
            change: priceData.change,
            source: priceData.source,
            lastUpdated: new Date().toISOString(),
          })
          .commit();
      } else {
        // Créer nouveau document
        await writeClient.create({
          _type: 'commodityPrice',
          product: priceData.product,
          price: priceData.price,
          unit: priceData.unit,
          trend: priceData.trend,
          change: priceData.change,
          source: priceData.source,
          lastUpdated: new Date().toISOString(),
        });
      }
    }
  }
}
