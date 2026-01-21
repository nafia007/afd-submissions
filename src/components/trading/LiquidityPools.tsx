
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus, Droplets } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const LiquidityPools = () => {
  const [tokenAmount, setTokenAmount] = useState("");
  const [usdcAmount, setUsdcAmount] = useState("");

  const pools = [
    {
      pair: "RWA-REAL/USDC",
      liquidity: "$2.4M",
      apr: "12.5%",
      volume24h: "$145K",
      fees24h: "$290",
    },
    {
      pair: "RWA-GOLD/USDC",
      liquidity: "$1.8M",
      apr: "8.7%",
      volume24h: "$89K",
      fees24h: "$178",
    },
    {
      pair: "RWA-ART/USDC",
      liquidity: "$956K",
      apr: "15.2%",
      volume24h: "$45K",
      fees24h: "$135",
    },
  ];

  const handleAddLiquidity = () => {
    if (!tokenAmount || !usdcAmount) {
      toast.error("Please enter both token amounts");
      return;
    }
    toast.success("Liquidity added successfully", {
      description: `Added ${tokenAmount} tokens and ${usdcAmount} USDC`,
    });
  };

  const handleRemoveLiquidity = () => {
    toast.success("Liquidity removed successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="w-5 h-5" />
          Liquidity Pools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pools" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pools">Pools</TabsTrigger>
            <TabsTrigger value="add">Add</TabsTrigger>
            <TabsTrigger value="remove">Remove</TabsTrigger>
          </TabsList>

          <TabsContent value="pools" className="mt-4">
            <div className="space-y-3">
              {pools.map((pool, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{pool.pair}</span>
                    <span className="text-green-600 font-medium">{pool.apr} APR</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <div>Liquidity</div>
                      <div className="font-medium text-foreground">{pool.liquidity}</div>
                    </div>
                    <div>
                      <div>24h Volume</div>
                      <div className="font-medium text-foreground">{pool.volume24h}</div>
                    </div>
                    <div>
                      <div>24h Fees</div>
                      <div className="font-medium text-foreground">{pool.fees24h}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add" className="mt-4">
            <div className="space-y-4">
              <div>
                <Label>RWA Token Amount</Label>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                />
              </div>
              <div>
                <Label>USDC Amount</Label>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={usdcAmount}
                  onChange={(e) => setUsdcAmount(e.target.value)}
                />
              </div>
              <Button 
                className="w-full gap-2"
                onClick={handleAddLiquidity}
              >
                <Plus className="w-4 h-4" />
                Add Liquidity
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="remove" className="mt-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Your Liquidity Position</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>RWA-REAL/USDC</span>
                    <span>$5,240</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Your share</span>
                    <span>0.21%</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="destructive"
                className="w-full gap-2"
                onClick={handleRemoveLiquidity}
              >
                <Minus className="w-4 h-4" />
                Remove Liquidity
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LiquidityPools;
