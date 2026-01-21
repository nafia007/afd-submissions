
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const TradingForm = () => {
  const [orderType, setOrderType] = useState("market");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState("");

  const handleTrade = (side: "buy" | "sell") => {
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }
    
    toast.success(`${side.charAt(0).toUpperCase() + side.slice(1)} order placed`, {
      description: `${amount} tokens ${side === "buy" ? "purchased" : "sold"}`,
    });
  };

  const calculateTotal = (priceValue: string, amountValue: string) => {
    const p = parseFloat(priceValue) || 0;
    const a = parseFloat(amountValue) || 0;
    setTotal((p * a).toFixed(2));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Order</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Order Type</Label>
            <Select value={orderType} onValueChange={setOrderType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">Market Order</SelectItem>
                <SelectItem value="limit">Limit Order</SelectItem>
                <SelectItem value="stop">Stop Order</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {orderType === "limit" && (
            <div>
              <Label>Price (USDC)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  calculateTotal(e.target.value, amount);
                }}
              />
            </div>
          )}

          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                calculateTotal(price, e.target.value);
              }}
            />
          </div>

          {orderType === "limit" && (
            <div>
              <Label>Total (USDC)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={total}
                readOnly
                className="bg-muted"
              />
            </div>
          )}

          <Tabs defaultValue="buy" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy">Buy</TabsTrigger>
              <TabsTrigger value="sell">Sell</TabsTrigger>
            </TabsList>
            <TabsContent value="buy" className="mt-4">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => handleTrade("buy")}
              >
                Buy {amount || "0"} Tokens
              </Button>
            </TabsContent>
            <TabsContent value="sell" className="mt-4">
              <Button 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => handleTrade("sell")}
              >
                Sell {amount || "0"} Tokens
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingForm;
