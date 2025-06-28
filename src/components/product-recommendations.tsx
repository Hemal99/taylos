
'use client';

import { useState, useTransition } from 'react';
import { getRecommendations } from '@/app/actions';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Skeleton } from './ui/skeleton';

interface Recommendation {
  name: string;
  description: string;
}

interface ProductRecommendationsProps {
  productDescriptions: string[];
  context: 'cart' | 'product';
}

export function ProductRecommendations({ productDescriptions, context }: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGetRecommendations = () => {
    startTransition(async () => {
      setError(null);
      const result = await getRecommendations(productDescriptions);
      if (result.error) {
        setError(result.error);
        setRecommendations([]);
      } else if (result.recommendations) {
        setRecommendations(result.recommendations);
      }
    });
  };

  if (productDescriptions.length === 0) return null;

  return (
    <div className="w-full">
        <h3 className="text-lg font-semibold mb-4 font-headline">
            {context === 'cart' ? 'You Might Also Like' : 'Related Products'}
        </h3>
        {recommendations.length > 0 ? (
            <div className="space-y-3">
            {recommendations.map((rec, index) => (
                <Card key={index} className="overflow-hidden flex items-center p-3 gap-4">
                  <div className="bg-muted rounded-md p-3 flex items-center justify-center">
                    <Wand2 className="w-6 h-6 text-primary"/>
                  </div>
                  <div className="flex-grow">
                      <p className="text-sm font-medium">{rec.name}</p>
                      <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                </Card>
            ))}
            </div>
        ) : isPending ? (
            <div className="space-y-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
        ) : (
            <Button onClick={handleGetRecommendations} disabled={isPending} className="w-full sm:w-auto">
                <Wand2 className="mr-2 h-4 w-4" />
                Show {context === 'cart' ? 'Recommendations' : 'Related Items'}
            </Button>
        )}

        {error && (
            <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
    </div>
  );
}
