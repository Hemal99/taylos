'use client';

import { useState, useEffect } from 'react';

export const useBrowsingHistory = () => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('browsingHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const addProductToHistory = (productDescription: string) => {
    const newHistory = [productDescription, ...history.filter(d => d !== productDescription)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('browsingHistory', JSON.stringify(newHistory));
  };

  return { history, addProductToHistory };
};
