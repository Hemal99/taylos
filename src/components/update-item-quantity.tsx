'use client';

import { useCart } from '@/context/cart-provider';
import { Button } from './ui/button';
import { Minus, Plus } from 'lucide-react';

interface UpdateItemQuantityProps {
  productId: string;
  quantity: number;
}

export function UpdateItemQuantity({ productId, quantity }: UpdateItemQuantityProps) {
  const { updateQuantity } = useCart();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => updateQuantity(productId, quantity - 1)}
        disabled={quantity === 1}
      >
        <Minus className="h-4 w-4" />
        <span className="sr-only">Decrease quantity</span>
      </Button>
      <span className="w-6 text-center font-medium">{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => updateQuantity(productId, quantity + 1)}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Increase quantity</span>
      </Button>
    </div>
  );
}
