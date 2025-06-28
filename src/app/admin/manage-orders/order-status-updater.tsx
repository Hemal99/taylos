'use client';

import { useTransition } from 'react';
import { type OrderStatus } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateOrderStatusAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const statusVariants: Record<OrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    Processing: 'secondary',
    Shipped: 'default',
    Delivered: 'outline',
    Cancelled: 'destructive',
};

export function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const onStatusChange = (newStatus: OrderStatus) => {
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, newStatus);
      if (result.success) {
        toast({ title: 'Success', description: result.success });
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
      }
    });
  };

  return (
    <Select onValueChange={onStatusChange} defaultValue={currentStatus} disabled={isPending}>
      <SelectTrigger className="w-fit min-w-[130px] focus:ring-0 focus:ring-offset-0">
        <SelectValue asChild>
          <Badge variant={statusVariants[currentStatus]} className="capitalize">
            {currentStatus}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Processing">Processing</SelectItem>
        <SelectItem value="Shipped">Shipped</SelectItem>
        <SelectItem value="Delivered">Delivered</SelectItem>
        <SelectItem value="Cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
}
