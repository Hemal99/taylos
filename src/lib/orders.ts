import { revalidatePath } from 'next/cache';
import { type CartItem, type Order, type OrderItem, type OrderStatus } from './types';
import { decreaseProductQuantity } from './products';
import { connectToDatabase } from './mongodb';
import { ObjectId, WithId } from 'mongodb';

function mapMongoId<T>(doc: WithId<T>): T & { id: string } {
  const { _id, ...rest } = doc;
  return { id: _id.toHexString(), ...rest } as T & { id: string };
}

export async function getOrders(): Promise<Order[]> {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection<Order>('orders');
    const orders = await ordersCollection.find().sort({ createdAt: -1 }).toArray();
    return orders.map(mapMongoId);
}

export async function createOrder(
  customerDetails: { name: string; email: string },
  cartItems: CartItem[],
  cartTotal: number
): Promise<Order> {
  const { db } = await connectToDatabase();
  const ordersCollection = db.collection<Order>('orders');

  const newOrder: Omit<Order, 'id'> = {
    customerName: customerDetails.name,
    customerEmail: customerDetails.email,
    items: cartItems.map(
      (item): OrderItem => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })
    ),
    total: cartTotal,
    status: 'Processing',
    createdAt: new Date(),
  };

  const result = await ordersCollection.insertOne(newOrder as Order);
  
  const itemsToDecrease = cartItems.map(item => ({
    id: item.id,
    quantity: item.quantity,
  }));
  await decreaseProductQuantity(itemsToDecrease);

  revalidatePath('/admin/manage-orders');

  return { ...newOrder, id: result.insertedId.toHexString() };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection('orders');
    const result = await ordersCollection.updateOne(
        { _id: new ObjectId(orderId) },
        { $set: { status: status } }
    );
    
    if (result.modifiedCount > 0) {
        revalidatePath('/admin/manage-orders');
        return { success: true };
    }
    return { success: false, error: 'Order not found or status is the same.' };
}
