'use server';

import { addProduct as addProductToDb, updateProduct as updateProductInDb, deleteProduct as deleteProductFromDb } from '@/lib/products';
import { type Product } from '@/lib/types';
import { z } from 'zod';

const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
    availableQuantity: z.coerce.number().int().min(0, 'Quantity must be a non-negative integer'),
    imageHint: z.string().optional(),
    isVisible: z.boolean().default(false),
});


export async function addProductAction(data: unknown) {
    const validatedFields = productSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            error: "Invalid data provided. Please check the form.",
        };
    }

    try {
        await addProductToDb(validatedFields.data as Omit<Product, 'id' | 'slug' | 'image'>);
        return { success: 'Product added successfully!' };
    } catch (e) {
        return { error: 'Failed to add product.' };
    }
}

export async function updateProductAction(id: string, data: unknown) {
    const validatedFields = productSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            error: "Invalid data provided. Please check the form.",
        };
    }
    
    try {
        await updateProductInDb(id, validatedFields.data);
        return { success: 'Product updated successfully!' };
    } catch (e) {
        return { error: 'Failed to update product.' };
    }
}

export async function deleteProductAction(id: string) {
    try {
        await deleteProductFromDb(id);
        return { success: 'Product deleted successfully!' };
    } catch (e) {
        return { error: 'Failed to delete product.' };
    }
}
