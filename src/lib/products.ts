import { revalidatePath } from 'next/cache';
import { type Product } from './types';
import * as data from './data';

export function getProducts(options: { includeHidden?: boolean } = {}): Product[] {
  if (options.includeHidden) {
    return data.products;
  }
  return data.products.filter(p => p.isVisible);
}

export function getProductById(id: string): Product | undefined {
    return data.products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  const product = data.products.find((p) => p.slug === slug);
  if (product && !product.isVisible) {
    return undefined;
  }
  return product;
}

export function addProduct(productData: Omit<Product, 'id' | 'slug' | 'image'>) {
    const newProduct: Product = {
        id: new Date().getTime().toString(),
        slug: productData.name.toLowerCase().replace(/\s+/g, '-'),
        image: `https://placehold.co/600x600/cccccc/FFFFFF.png?text=${encodeURIComponent(productData.name)}`,
        ...productData,
    };
    data.products.unshift(newProduct);
    revalidatePath('/admin/manage-inventory');
    revalidatePath('/');
    return newProduct;
}

export function updateProduct(id: string, productData: Partial<Product>) {
    const product = data.products.find(p => p.id === id);
    if (product) {
        const oldSlug = product.slug;
        const newSlug = productData.name ? productData.name.toLowerCase().replace(/\s+/g, '-') : oldSlug;
        
        data.products = data.products.map(p => p.id === id ? { ...p, ...productData, slug: newSlug } : p);

        revalidatePath('/admin/manage-inventory');
        revalidatePath('/');
        if (oldSlug !== newSlug) {
            revalidatePath(`/product/${oldSlug}`);
        }
        revalidatePath(`/product/${newSlug}`);
    }
}

export function deleteProduct(id: string) {
    data.products = data.products.filter(p => p.id !== id);
    revalidatePath('/admin/manage-inventory');
    revalidatePath('/');
}

export function decreaseProductQuantity(items: { id: string; quantity: number }[]) {
    items.forEach(item => {
        const product = getProductById(item.id);
        if (product) {
            const newQuantity = product.availableQuantity - item.quantity;
            updateProduct(item.id, { availableQuantity: newQuantity < 0 ? 0 : newQuantity });
        }
    });
}
