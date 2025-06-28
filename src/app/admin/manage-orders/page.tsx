import { getOrders } from '@/lib/orders';
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatPrice } from '@/lib/utils';
import { OrderStatusUpdater } from './order-status-updater';

export default async function ManageOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
        <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
        <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{order.id}</TableCell>
                        <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.customerEmail}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{formatPrice(order.total)}</TableCell>
                        <TableCell className="flex justify-center">
                          <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
        </Card>
    </div>
  );
}
