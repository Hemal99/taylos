'use server';

import { updateOrderStatus } from '@/lib/orders';
import { type OrderStatus } from '@/lib/types';

export async function updateOrderStatusAction(orderId: string, status: OrderStatus) {
  try {
    const result = await updateOrderStatus(orderId, status);
    if (!result.success) {
      return { error: result.error };
    }
    return { success: 'Order status updated successfully!' };
  } catch (e: any) {
    return { error: e.message || 'Failed to update order status.' };
  }
}
