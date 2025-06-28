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
    isVisible: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
});


export async function addProductAction(formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        availableQuantity: formData.get('availableQuantity'),
        isVisible: formData.get('isVisible'),
        imageHint: formData.get('imageHint'),
    };
    const validatedFields = productSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        return {
            error: "Invalid data provided. Please check the form.",
        };
    }

    const imageFile = formData.get('image') as File | null;
    if (!imageFile || imageFile.size === 0) {
        return { error: 'Product image is required.' };
    }

    try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const dataUri = `data:${imageFile.type};base64,${buffer.toString('base64')}`;

        await addProductToDb({ ...validatedFields.data, image: dataUri });
        return { success: 'Product added successfully!' };
    } catch (e: any) {
        return { error: e.message || 'Failed to add product.' };
    }
}

export async function updateProductAction(id: string, formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: formData.get('price'),
        availableQuantity: formData.get('availableQuantity'),
        isVisible: formData.get('isVisible'),
        imageHint: formData.get('imageHint'),
    };
    const validatedFields = productSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            error: "Invalid data provided. Please check the form.",
        };
    }
    
    const updateData: Partial<Product> = { ...validatedFields.data };
    const imageFile = formData.get('image') as File | null;

    try {
        if (imageFile && imageFile.size > 0) {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            updateData.image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
        }
        await updateProductInDb(id, updateData);
        return { success: 'Product updated successfully!' };
    } catch (e: any) {
        return { error: e.message || 'Failed to update product.' };
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
