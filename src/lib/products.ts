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
    const productsCollection = db.collection('products');
    const count = await productsCollection.countDocuments();
    if (count === 0) {
        console.log('Seeding database with initial products...');
        const productsToSeed = data.products.map(({ id, ...rest }) => rest);
        await productsCollection.insertMany(productsToSeed);
    }
}

export async function getProducts(options: { includeHidden?: boolean } = {}): Promise<Product[]> {
    const { db } = await connectToDatabase();
    await seedDatabase();
    const productsCollection = db.collection<Product>('products');
    
    const query = options.includeHidden ? {} : { isVisible: true };

    const products = await productsCollection.find(query).toArray();
    return products.map(mapMongoId);
}

export async function getProductById(id: string): Promise<Product | undefined> {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');
    const product = await productsCollection.findOne({ _id: new ObjectId(id) });
    return product ? mapMongoId(product) : undefined;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');
    const product = await productsCollection.findOne({ slug });

    if (product && !product.isVisible) {
      return undefined;
    }
    return product ? mapMongoId(product) : undefined;
}

export async function addProduct(productData: Omit<Product, 'id' | 'slug' | 'image'>): Promise<Product> {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection<Product>('products');

    const newProduct: Omit<Product, 'id'> = {
        slug: productData.name.toLowerCase().replace(/\s+/g, '-'),
        image: `https://placehold.co/600x600/cccccc/FFFFFF.png?text=${encodeURIComponent(productData.name)}`,
        ...productData,
    };
    const result = await productsCollection.insertOne(newProduct as Product);
    revalidatePath('/admin/manage-inventory');
    revalidatePath('/');
    return { ...newProduct, id: result.insertedId.toHexString() };
}

export async function updateProduct(id: string, productData: Partial<Product>) {
    const { db } = await connectToDatabase();
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
    const productsCollection = db.collection('products');
    await productsCollection.deleteOne({ _id: new ObjectId(id) });

    revalidatePath('/admin/manage-inventory');
    revalidatePath('/');
}

export async function decreaseProductQuantity(items: { id: string; quantity: number }[]) {
    const { db } = await connectToDatabase();
    const productsCollection = db.collection('products');
    
    const bulkOperations = items.map(item => ({
        updateOne: {
            filter: { _id: new ObjectId(item.id) },
            update: { $inc: { availableQuantity: -item.quantity } }
        }
    }));
    
    if (bulkOperations.length > 0) {
        await productsCollection.bulkWrite(bulkOperations);
    }
}
