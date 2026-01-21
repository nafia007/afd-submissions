
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
  type: "buy" | "sell";
  status: "pending" | "filled" | "cancelled";
  asset: string;
  amount: number;
  price: number;
  total: number;
  timestamp: string;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      type: "buy",
      status: "pending",
      asset: "RWA-REAL",
      amount: 10,
      price: 1240,
      total: 12400,
      timestamp: "2024-01-15 14:30:25",
    },
    {
      id: "2",
      type: "sell",
      status: "filled",
      asset: "RWA-GOLD",
      amount: 5,
      price: 2100,
      total: 10500,
      timestamp: "2024-01-15 13:45:12",
    },
    {
      id: "3",
      type: "buy",
      status: "cancelled",
      asset: "RWA-ART",
      amount: 2,
      price: 5000,
      total: 10000,
      timestamp: "2024-01-15 12:15:33",
    },
  ]);

  const handleCancelOrder = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: "cancelled" as const }
        : order
    ));
    toast.success("Order cancelled successfully");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "filled":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "default";
      case "filled":
        return "default";
      case "cancelled":
        return "secondary";
      default:
        return "default";
    }
  };

  const openOrders = orders.filter(order => order.status === "pending");
  const orderHistory = orders.filter(order => order.status !== "pending");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="open" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="open">Open Orders ({openOrders.length})</TabsTrigger>
            <TabsTrigger value="history">Order History</TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="mt-4">
            {openOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No open orders
              </div>
            ) : (
              <div className="space-y-3">
                {openOrders.map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={order.type === "buy" ? "default" : "secondary"}>
                          {order.type.toUpperCase()}
                        </Badge>
                        <span className="font-medium">{order.asset}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Amount</div>
                        <div className="font-medium">{order.amount}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Price</div>
                        <div className="font-medium">${order.price}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Total</div>
                        <div className="font-medium">${order.total.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {order.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-3">
              {orderHistory.map((order) => (
                <div key={order.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={order.type === "buy" ? "default" : "secondary"}>
                        {order.type.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{order.asset}</span>
                      <Badge variant={getStatusColor(order.status)} className="gap-1">
                        {getStatusIcon(order.status)}
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Amount</div>
                      <div className="font-medium">{order.amount}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Price</div>
                      <div className="font-medium">${order.price}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Total</div>
                      <div className="font-medium">${order.total.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {order.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OrderManagement;
