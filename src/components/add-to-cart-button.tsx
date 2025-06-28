'use client';

import { useCart } from '@/context/cart-provider';
import { type Product } from '@/lib/types';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <Button size="lg" className="w-full" onClick={() => addToCart(product)}>
      <ShoppingCart className="mr-2 h-5 w-5" />
      Add to Cart
    </Button>
  );
}
