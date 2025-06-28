'use client';

import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/context/cart-provider';
import { ShoppingCart } from 'lucide-react';
import { CartItemCard } from './cart-item-card';
import { formatPrice } from '@/lib/utils';
import { ProductRecommendations } from './product-recommendations';

export function CartSheet() {
  const { cartItems, cartCount, cartTotal } = useCart();
  const productDescriptions = cartItems.map(item => item.description);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Open cart</span>
          {cartCount > 0 && (
            <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {cartCount}
            </div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Cart {cartCount > 0 && `(${cartCount})`}</SheetTitle>
        </SheetHeader>
        {cartCount > 0 ? (
          <>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 px-6">
                {cartItems.map(item => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>
             {cartItems.length > 0 && (
                <div className="px-6 mt-4">
                  <ProductRecommendations
                    productDescriptions={productDescriptions}
                    context="cart"
                  />
                </div>
              )}
            <SheetFooter className="flex flex-col gap-4 px-6 mt-auto pt-4 border-t">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <Button asChild className="w-full">
                <Link href="/checkout">Continue to Checkout</Link>
              </Button>
            </SheetFooter>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <SheetTrigger asChild>
                <Button variant="link" asChild>
                    <Link href="/">Start Shopping</Link>
                </Button>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
