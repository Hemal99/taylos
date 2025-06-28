
'use client';

import { useState, useTransition, useEffect } from 'react';
import { getRecommendationsFromHistory } from '@/app/actions';
import { Card, CardContent } from './ui/card';
import { Wand2, History } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Skeleton } from './ui/skeleton';
import { useBrowsingHistory } from '@/hooks/use-browsing-history';

interface Recommendation {
  name: string;
  description: string;
}

export function BrowsingHistoryRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { history } = useBrowsingHistory();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (history.length > 0 && !hasFetched && !isPending) {
      setHasFetched(true);
      startTransition(async () => {
        setError(null);
        const result = await getRecommendationsFromHistory(history);
        if (result.error) {
          setError(result.error);
          setRecommendations([]);
        } else if (result.recommendations) {
          setRecommendations(result.recommendations);
        }
      });
    }
  }, [history, hasFetched, isPending]);


  if (history.length === 0) {
    return null;
  }
  
  if (!isPending && recommendations.length === 0 && hasFetched && !error) {
    return null;
  }

  return (
    <div className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-6 font-headline flex items-center gap-3">
            <History className="w-8 h-8" />
            Based on Your Browsing
        </h2>
        {isPending ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
            </div>
        ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => (
                <Card key={index} className="overflow-hidden group transition-shadow hover:shadow-lg">
                  <div className="aspect-video bg-muted flex items-center justify-center relative">
                      <Wand2 className="w-12 h-12 text-muted-foreground/30 transition-transform group-hover:scale-110" />
                  </div>
                  <CardContent className="p-4">
                      <h3 className="text-md font-semibold truncate" title={rec.name}>{rec.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 truncate" title={rec.description}>{rec.description}</p>
                  </CardContent>
                </Card>
            ))}
            </div>
        ) : null}
        
        {error && (
            <Alert variant="destructive" className="mt-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
    </div>
  );
}
