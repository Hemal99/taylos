'use client';

import Image from 'next/image';
import { type CartItem } from '@/lib/types';
import { useCart } from '@/context/cart-provider';
import { formatPrice } from '@/lib/utils';
import { UpdateItemQuantity } from './update-item-quantity';
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';

interface CartItemProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemProps) {
  const { removeFromCart } = useCart();

  return (
    <div className="flex items-start gap-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-md">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          data-ai-hint={item.imageHint}
        />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
        <div className="mt-2 flex items-center justify-between">
            <UpdateItemQuantity productId={item.id} quantity={item.quantity} />
            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} aria-label='Remove item'>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
        </div>
      </div>
    </div>
  );
}
