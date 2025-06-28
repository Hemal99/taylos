'use client';

import { useState, useEffect, useCallback } from 'react';

export const useBrowsingHistory = () => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('browsingHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const addProductToHistory = useCallback((productDescription: string) => {
    setHistory(prevHistory => {
      const newHistory = [
        productDescription,
        ...prevHistory.filter(d => d !== productDescription),
      ].slice(0, 5);
      localStorage.setItem('browsingHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  return { history, addProductToHistory };
};
