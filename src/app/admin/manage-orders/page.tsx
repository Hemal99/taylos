import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function ManageOrdersPage() {
  return (
    <div>
        <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
        <Card>
            <CardContent className="pt-6">
                <div className="text-center p-8">
                    <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">Order Management Coming Soon</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        This section will allow you to view and manage customer orders.
                    </p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
