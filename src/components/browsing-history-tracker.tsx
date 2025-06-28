'use client';

import { useEffect } from 'react';
import { useBrowsingHistory } from '@/hooks/use-browsing-history';

export function BrowsingHistoryTracker({ productDescription }: { productDescription: string }) {
  const { addProductToHistory } = useBrowsingHistory();
  useEffect(() => {
    addProductToHistory(productDescription);
  }, [productDescription, addProductToHistory]);

  return null;
}
