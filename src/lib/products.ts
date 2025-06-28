import { type Product } from './types';

const products: Product[] = [
  {
    id: '1',
    name: 'Classic Denim Jacket',
    slug: 'classic-denim-jacket',
    description: 'A timeless denim jacket, perfect for layering. Made with 100% organic cotton for a comfortable fit and feel. Features classic button-front closure and two chest pockets.',
    price: 89.99,
    image: 'https://placehold.co/600x600/5E7CE2/FFFFFF.png',
    imageHint: 'denim jacket',
  },
  {
    id: '2',
    name: 'Linen Blend Shirt',
    slug: 'linen-blend-shirt',
    description: 'Stay cool and stylish with this breathable linen-blend shirt. Ideal for warm weather, it offers a relaxed fit and a sharp look for any casual occasion.',
    price: 49.99,
    image: 'https://placehold.co/600x600/F0EFEB/333333.png',
    imageHint: 'linen shirt',
  },
  {
    id: '3',
    name: 'Slim-Fit Chinos',
    slug: 'slim-fit-chinos',
    description: 'Versatile and modern slim-fit chinos that can be dressed up or down. Crafted from a soft-stretch cotton twill for all-day comfort and a perfect fit.',
    price: 64.99,
    image: 'https://placehold.co/600x600/D2B48C/FFFFFF.png',
    imageHint: 'chinos pants',
  },
  {
    id: '4',
    name: 'Leather Ankle Boots',
    slug: 'leather-ankle-boots',
    description: 'Step up your shoe game with these stylish leather ankle boots. Featuring a sleek design, durable sole, and cushioned insole for maximum comfort.',
    price: 129.99,
    image: 'https://placehold.co/600x600/5D4037/FFFFFF.png',
    imageHint: 'leather boots',
  },
  {
    id: '5',
    name: 'Merino Wool Sweater',
    slug: 'merino-wool-sweater',
    description: 'A luxurious and soft merino wool sweater. This lightweight knit provides excellent warmth and is perfect for layering during colder months. A true wardrobe staple.',
    price: 99.99,
    image: 'https://placehold.co/600x600/808080/FFFFFF.png',
    imageHint: 'wool sweater',
  },
  {
    id: '6',
    name: 'Graphic Print T-Shirt',
    slug: 'graphic-print-t-shirt',
    description: 'Express yourself with this unique graphic print t-shirt. Made from soft, high-quality cotton for a comfortable fit and feel, featuring a bold, artistic design.',
    price: 34.99,
    image: 'https://placehold.co/600x600/212121/FFFFFF.png',
    imageHint: 'graphic t-shirt',
  },
  {
    id: '7',
    name: 'Tailored Wool Blazer',
    slug: 'tailored-wool-blazer',
    description: 'A sharp and sophisticated tailored wool blazer. Fully lined with a structured fit, it adds a touch of class to any outfit, whether for business or formal events.',
    price: 199.99,
    image: 'https://placehold.co/600x600/424242/FFFFFF.png',
    imageHint: 'wool blazer',
  },
  {
    id: '8',
    name: 'Performance Joggers',
    slug: 'performance-joggers',
    description: 'Comfort meets performance in these stylish joggers. Made with moisture-wicking fabric, they are perfect for the gym or a relaxed day out. Tapered fit and zip pockets.',
    price: 79.99,
    image: 'https://placehold.co/600x600/37474F/FFFFFF.png',
    imageHint: 'performance joggers',
  },
];

export function getProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
