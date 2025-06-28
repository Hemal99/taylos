import { revalidatePath } from 'next/cache';
import { type CartItem, type Order, type OrderItem, type OrderStatus } from './types';
import { decreaseProductQuantity } from './products';
import * as data from './data';

export function getOrders(): Order[] {
  // Return a copy to prevent mutations from leaking
  return [...data.orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function createOrder(
  customerDetails: { name: string; email: string },
  cartItems: CartItem[],
  cartTotal: number
): Promise<Order> {
  const newOrder: Order = {
    id: new Date().getTime().toString(),
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

  data.orders.unshift(newOrder);

  const itemsToDecrease = cartItems.map(item => ({
    id: item.id,
    quantity: item.quantity,
  }));
  decreaseProductQuantity(itemsToDecrease);

  revalidatePath('/admin/manage-orders');

  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const order = data.orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    revalidatePath('/admin/manage-orders');
    return { success: true };
  }
  return { success: false, error: 'Order not found.' };
}
