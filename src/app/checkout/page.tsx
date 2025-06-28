'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }
    clearCart();
    router.push('/order-confirmation');
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8 font-headline">
        Checkout
      </h1>
      <form onSubmit={handlePlaceOrder} className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Main St" required />
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="**** **** **** 1234" required />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-md" data-ai-hint={item.imageHint} />
                      <div>
                        <p>{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p>{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Your cart is empty.</p>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <p>Total</p>
                <p>{formatPrice(cartTotal)}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" size="lg" disabled={cartItems.length === 0}>
                Place Order
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
