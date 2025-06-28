
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/products";
import { type Product } from "@/lib/types";
import { BrowsingHistoryRecommendations } from "@/components/browsing-history-recommendations";

export default async function Home() {
  const products = await getProducts();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-8 font-headline">
        New Arrivals
      </h1>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <BrowsingHistoryRecommendations />
    </div>
  );
}
