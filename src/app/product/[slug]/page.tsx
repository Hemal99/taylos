import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getProductBySlug } from '@/lib/products';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { formatPrice } from '@/lib/utils';
import { BrowsingHistoryTracker } from '@/components/browsing-history-tracker';
import { ProductRecommendations } from '@/components/product-recommendations';
import { Badge } from '@/components/ui/badge';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const isOutOfStock = product.availableQuantity <= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <BrowsingHistoryTracker productDescription={product.description} />
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-card shadow-lg relative">
          <Image
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            className="h-full w-full object-cover object-center"
            data-ai-hint={product.imageHint}
          />
           {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg">Out of Stock</Badge>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-headline">
            {product.name}
          </h1>
          <p className="mt-4 text-3xl text-foreground">{formatPrice(product.price)}</p>
          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="space-y-6 text-base text-muted-foreground">
              <p>{product.description}</p>
            </div>
          </div>
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
      <div className="mt-16">
        <ProductRecommendations productDescriptions={[product.description]} context="product" />
      </div>
    </div>
  );
}
