'use server';
/**
 * @fileOverview Provides product recommendations based on user browsing history.
 *
 * - getProductRecommendations - A function that retrieves product recommendations based on browsing history.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  browsingHistory: z.array(z.string()).describe('A list of product descriptions representing the user\'s browsing history.'),
});
export type ProductRecommendationsInput = z.infer<typeof ProductRecommendationsInputSchema>;

const ProductRecommendationsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      name: z.string().describe('The name of the recommended product.'),
      description: z.string().describe('A short description of the recommended product.'),
    })
  ).describe('A list of recommended products based on the browsing history.'),
});
export type ProductRecommendationsOutput = z.infer<typeof ProductRecommendationsOutputSchema>;

export async function getProductRecommendations(input: ProductRecommendationsInput): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: ProductRecommendationsInputSchema},
  output: {schema: ProductRecommendationsOutputSchema},
  prompt: `You are a product recommendation expert for an online clothing store.
  Given a user's browsing history, recommend up to 3 related products that they might be interested in.
  The browsing history is a list of product descriptions.
  Try to vary the recommendations.

  Browsing History:
  {{#each browsingHistory}}- {{{this}}}
  {{/each}}`,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
