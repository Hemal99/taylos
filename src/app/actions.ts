
'use server';

import { productRecommendations } from '@/ai/flows/product-recommendations';
import { getProductRecommendations as getProductRecommendationsFromHistory } from '@/ai/flows/product-recommendations-from-history';

export async function getRecommendations(productDescriptions: string[]) {
  try {
    if (!productDescriptions || productDescriptions.length === 0) {
      return { recommendations: [], error: null };
    }
    const result = await productRecommendations({ productDescriptions });
    return { recommendations: result.recommendedProducts, error: null };
  } catch (e: any) {
    console.error(e);
    return { recommendations: null, error: e.message || "Failed to fetch recommendations." };
  }
}

export async function getRecommendationsFromHistory(browsingHistory: string[]) {
  try {
    if (!browsingHistory || browsingHistory.length === 0) {
      return { recommendations: [], error: null };
    }
    const result = await getProductRecommendationsFromHistory({ browsingHistory });
    return { recommendations: result.recommendations, error: null };
  } catch (e: any) {
    console.error(e);
    return { recommendations: null, error: e.message || "Failed to fetch recommendations." };
  }
}
