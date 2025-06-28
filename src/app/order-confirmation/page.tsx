import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmationPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 flex items-center justify-center">
      <Card className="w-full text-center">
        <CardHeader>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold mt-4 font-headline">Thank you for your order!</CardTitle>
          <CardDescription className="text-muted-foreground pt-2">
            Your order has been placed successfully. A confirmation email has been sent to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
