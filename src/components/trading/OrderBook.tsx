
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Order {
  price: number;
  amount: number;
  total: number;
}

interface OrderBookProps {
  buyOrders: Order[];
  sellOrders: Order[];
}

const OrderBook = ({ buyOrders, sellOrders }: OrderBookProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Order Book</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Sell Orders */}
        <div className="p-4 border-b">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Price (USDC)</span>
            <span>Amount</span>
            <span>Total</span>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {sellOrders.slice(0, 8).map((order, index) => (
              <div key={index} className="flex justify-between text-sm text-red-500">
                <span>${order.price.toFixed(2)}</span>
                <span>{order.amount.toFixed(2)}</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Price */}
        <div className="p-4 border-b bg-muted/20">
          <div className="text-center">
            <div className="text-2xl font-bold">$1,234.56</div>
            <div className="text-sm text-green-500">+2.34% (+$28.45)</div>
          </div>
        </div>

        {/* Buy Orders */}
        <div className="p-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Price (USDC)</span>
            <span>Amount</span>
            <span>Total</span>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {buyOrders.slice(0, 8).map((order, index) => (
              <div key={index} className="flex justify-between text-sm text-green-500">
                <span>${order.price.toFixed(2)}</span>
                <span>{order.amount.toFixed(2)}</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderBook;
