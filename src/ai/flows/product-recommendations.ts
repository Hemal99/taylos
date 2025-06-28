'use server';

/**
 * @fileOverview AI flow for generating product recommendations based on the items in the shopping cart.
 *
 * - productRecommendations - A function that generates product recommendations.
 * - ProductRecommendationsInput - The input type for the productRecommendations function, an array of descriptions.
 * - ProductRecommendationsOutput - The return type for the productRecommendations function, an array of product names.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  productDescriptions: z
    .array(z.string())
    .describe('An array of product descriptions from the user cart.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  recommendedProducts: z
    .array(
      z.object({
        name: z.string().describe('The name of the recommended product.'),
        description: z.string().describe('A short description of the recommended product.'),
      })
    )
    .describe('An array of recommended product names based on the cart items.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function productRecommendations(
  input: ProductRecommendationsInput
): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const productRecommendationsPrompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are an e-commerce product recommendation expert.

  Based on the following product descriptions from the user's shopping cart, recommend up to 3 additional products that the user might be interested in. Return the product name and a short description for each.

  Product Descriptions:
  {{#each productDescriptions}}
  - {{{this}}}
  {{/each}}

  Return the recommendations as a list of product names and descriptions.
  `,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await productRecommendationsPrompt(input);
    return output!;
  }
);
