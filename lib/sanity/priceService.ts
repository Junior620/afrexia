import { client, writeClient } from '@/sanity/lib/client';

interface PriceData {
  product: string;
  price: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  source: string;
}

export interface PriceHistoryEntry extends PriceData {
  recordedAt: string;
}

export class PriceServiceServer {
  /**
   * Récupère tous les prix actuels depuis Sanity
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
   * Récupère l'historique des prix pour un produit donné
   * @param product - Nom du produit (ex: "Cacao", "Café Arabica")
   * @param limit - Nombre d'entrées à retourner (défaut: 30)
   */
  static async getPriceHistory(product: string, limit = 30): Promise<PriceHistoryEntry[]> {
    const query = `*[_type == "priceHistory" && product == $product] | order(recordedAt desc) [0...$limit] {
      product,
      price,
      unit,
      trend,
      change,
      source,
      recordedAt
    }`;

    return await client.fetch(query, { product, limit });
  }

  /**
   * Récupère l'historique de tous les produits
   * @param limit - Nombre d'entrées par produit (défaut: 30)
   */
  static async getAllPriceHistory(limit = 30): Promise<PriceHistoryEntry[]> {
    const query = `*[_type == "priceHistory"] | order(recordedAt desc) [0...$limit] {
      product,
      price,
      unit,
      trend,
      change,
      source,
      recordedAt
    }`;

    return await client.fetch(query, { limit });
  }

  /**
   * Met à jour le prix actuel ET sauvegarde dans l'historique
   */
  static async updatePrices(prices: PriceData[]): Promise<void> {
    const now = new Date().toISOString();

    for (const priceData of prices) {
      // 1. Mettre à jour ou créer le document commodityPrice (prix actuel)
      const existing = await client.fetch(
        `*[_type == "commodityPrice" && product == $product][0]`,
        { product: priceData.product }
      );

      if (existing) {
        await writeClient
          .patch(existing._id)
          .set({
            price: priceData.price,
            unit: priceData.unit,
            trend: priceData.trend,
            change: priceData.change,
            source: priceData.source,
            lastUpdated: now,
          })
          .commit();
      } else {
        await writeClient.create({
          _type: 'commodityPrice',
          product: priceData.product,
          price: priceData.price,
          unit: priceData.unit,
          trend: priceData.trend,
          change: priceData.change,
          source: priceData.source,
          lastUpdated: now,
        });
      }

      // 2. Créer une entrée dans l'historique
      await writeClient.create({
        _type: 'priceHistory',
        product: priceData.product,
        price: priceData.price,
        unit: priceData.unit,
        trend: priceData.trend,
        change: priceData.change,
        source: priceData.source,
        recordedAt: now,
      });
    }
  }
}
