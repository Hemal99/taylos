import { revalidatePath } from 'next/cache';
import { type CartItem, type Order, type OrderItem, type OrderStatus } from './types';
import { decreaseProductQuantity } from './products';
import { connectToDatabase } from './mongodb';
import { ObjectId, WithId } from 'mongodb';
import * as data from './data';

function mapMongoId<T>(doc: WithId<T>): T & { id: string } {
  const { _id, ...rest } = doc;
  return { id: _id.toHexString(), ...rest } as T & { id: string };
}

export async function getOrders(): Promise<Order[]> {
    const { db } = await connectToDatabase();
    if (!db) {
        return [...data.orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

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

  const newOrderStub: Omit<Order, 'id'> = {
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

  if (!db) {
      const newOrder: Order = {
          ...newOrderStub,
          id: new Date().getTime().toString(),
      };
      data.orders.unshift(newOrder);
      const itemsToDecrease = cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
      }));
      await decreaseProductQuantity(itemsToDecrease);
      revalidatePath('/admin/manage-orders');
      return newOrder;
  }

  const ordersCollection = db.collection<Order>('orders');
  const result = await ordersCollection.insertOne(newOrderStub as Order);
  
  const itemsToDecrease = cartItems.map(item => ({
    id: item.id,
    quantity: item.quantity,
  }));
  await decreaseProductQuantity(itemsToDecrease);

  revalidatePath('/admin/manage-orders');

  return { ...newOrderStub, id: result.insertedId.toHexString() };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    const { db } = await connectToDatabase();

    if (!db) {
        const order = data.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            revalidatePath('/admin/manage-orders');
            return { success: true };
        }
        return { success: false, error: 'Order not found.' };
    }
    
    if (!ObjectId.isValid(orderId)) {
        return { success: false, error: 'Invalid Order ID format.' };
    }

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
