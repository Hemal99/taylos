'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type Product } from '@/lib/types';
import { Button } from './ui/button';
import { useCart } from '@/context/cart-provider';
import { formatPrice } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="group relative flex flex-col">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-card transition-shadow group-hover:shadow-lg">
        <Link href={`/product/${product.slug}`}>
            <Image
              src={product.image}
              alt={product.name}
              width={600}
              height={600}
              className="h-full w-full object-cover object-center transition-transform group-hover:scale-105"
              data-ai-hint={product.imageHint}
            />
        </Link>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-foreground">
            <Link href={`/product/${product.slug}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{product.description.split('.')[0]}.</p>
        </div>
        <p className="text-sm font-medium text-foreground">{formatPrice(product.price)}</p>
      </div>
      <div className="mt-4">
         <Button 
            variant="outline" 
            className="w-full transition-colors hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart`}
            >
             <Plus className="mr-2 h-4 w-4" /> Add to cart
        </Button>
      </div>
    </div>
  );
}
