import { revalidatePath } from 'next/cache';
import { type Product } from './types';
import * as data from './data';
import { connectToDatabase } from './mongodb';
import { ObjectId, WithId } from 'mongodb';

function mapMongoId<T>(doc: WithId<T>): T & { id: string } {
    const { _id, ...rest } = doc;
    return { id: _id.toHexString(), ...rest } as T & { id: string };
}

async function seedDatabase() {
    const { db } = await connectToDatabase();
    if (!db) return; // Don't seed if no DB

    try {
        const productsCollection = db.collection('products');
        const count = await productsCollection.countDocuments();
        if (count === 0) {
            console.log('Seeding database with initial products...');
            const productsToSeed = data.products.map(({ id, ...rest }) => rest);
            await productsCollection.insertMany(productsToSeed);
        }
    } catch (error) {
        console.error("Failed to seed database:", error);
    }
}

export async function getProducts(options: { includeHidden?: boolean } = {}): Promise<Product[]> {
    const { db } = await connectToDatabase();
    
    if (!db) {
        return options.includeHidden 
            ? data.products 
            : data.products.filter(p => p.isVisible);
    }
    
    await seedDatabase();
    const productsCollection = db.collection<Product>('products');
    
    const query = options.includeHidden ? {} : { isVisible: true };

    const products = await productsCollection.find(query).toArray();
    return products.map(mapMongoId);
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const { db } = await connectToDatabase();
    if (!db) {
        return data.products.find(p => p.id === id);
    }
    
    if (!ObjectId.isValid(id)) return undefined;

    const productsCollection = db.collection<Product>('products');
    const product = await productsCollection.findOne({ _id: new ObjectId(id) });
    return product ? mapMongoId(product) : undefined;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
    const { db } = await connectToDatabase();
    
    if (!db) {
        const product = data.products.find(p => p.slug === slug);
        if (product && !product.isVisible) {
            return undefined;
        }
        return product;
    }

    const productsCollection = db.collection<Product>('products');
    const product = await productsCollection.findOne({ slug });

    if (product && !product.isVisible) {
      return undefined;
    }
    return product ? mapMongoId(product) : undefined;
}

export async function addProduct(productData: Omit<Product, 'id' | 'slug' | 'image'>): Promise<Product> {
    const { db } = await connectToDatabase();

    const newProductStub: Omit<Product, 'id'> = {
        slug: productData.name.toLowerCase().replace(/\s+/g, '-'),
        image: `https://placehold.co/600x600/cccccc/FFFFFF.png?text=${encodeURIComponent(productData.name)}`,
        ...productData,
    };

    if (!db) {
        const newProduct: Product = {
            ...newProductStub,
            id: new Date().getTime().toString(),
        }
        data.products.push(newProduct);
        revalidatePath('/admin/manage-inventory');
        revalidatePath('/');
        return newProduct;
    }

    const productsCollection = db.collection<Product>('products');
    const result = await productsCollection.insertOne(newProductStub as Product);
    revalidatePath('/admin/manage-inventory');
    revalidatePath('/');
    return { ...newProductStub, id: result.insertedId.toHexString() };
}

export async function updateProduct(id: string, productData: Partial<Product>) {
    const { db } = await connectToDatabase();
    
    if (!db) {
        const productIndex = data.products.findIndex(p => p.id === id);
        if (productIndex === -1) return;
        const oldProduct = data.products[productIndex];
        const oldSlug = oldProduct.slug;

        data.products[productIndex] = { ...oldProduct, ...productData };
        
        const newSlug = productData.name ? productData.name.toLowerCase().replace(/\s+/g, '-') : oldSlug;
        data.products[productIndex].slug = newSlug;

        revalidatePath('/admin/manage-inventory');
        revalidatePath('/');
        if (oldSlug !== newSlug) {
            revalidatePath(`/product/${oldSlug}`);
        }
        revalidatePath(`/product/${newSlug}`);
        return;
    }

    if (!ObjectId.isValid(id)) return;

    const productsCollection = db.collection('products');
    
    const oldProduct = await productsCollection.findOne({ _id: new ObjectId(id) });
    if (!oldProduct) return;
    
    const oldSlug = oldProduct.slug;
    const newSlug = productData.name ? productData.name.toLowerCase().replace(/\s+/g, '-') : oldSlug;
    
    await productsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...productData, slug: newSlug } }
    );
    
    revalidatePath('/admin/manage-inventory');
    revalidatePath('/');
    if (oldSlug !== newSlug) {
        revalidatePath(`/product/${oldSlug}`);
    }
    revalidatePath(`/product/${newSlug}`);
}

export async function deleteProduct(id: string) {
    const { db } = await connectToDatabase();

    if (!db) {
        data.products = data.products.filter(p => p.id !== id);
        revalidatePath('/admin/manage-inventory');
        revalidatePath('/');
        return;
    }

    if (!ObjectId.isValid(id)) return;

    const productsCollection = db.collection('products');
    await productsCollection.deleteOne({ _id: new ObjectId(id) });

    revalidatePath('/admin/manage-inventory');
    revalidatePath('/');
}

export async function decreaseProductQuantity(items: { id: string; quantity: number }[]) {
    const { db } = await connectToDatabase();

    if (!db) {
        items.forEach(item => {
            const product = data.products.find(p => p.id === item.id);
            if (product) {
                product.availableQuantity -= item.quantity;
            }
        });
        return;
    }
    
    const bulkOperations = items.map(item => {
        if (!ObjectId.isValid(item.id)) return null;
        return {
            updateOne: {
                filter: { _id: new ObjectId(item.id) },
                update: { $inc: { availableQuantity: -item.quantity } }
            }
        }
    }).filter(op => op !== null);
    
    if (bulkOperations.length > 0) {
        const productsCollection = db.collection('products');
        await productsCollection.bulkWrite(bulkOperations as any);
    }
}
