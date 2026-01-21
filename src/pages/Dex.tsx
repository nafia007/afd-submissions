
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp, Wallet, Info, ChartBar, TrendingUp, Zap, Film, DollarSign, Lock, BarChart, Crown } from "lucide-react";
import { toast } from "sonner";
import OrderBook from "@/components/trading/OrderBook";
import TradingForm from "@/components/trading/TradingForm";
import LiquidityPools from "@/components/trading/LiquidityPools";
import PriceChart from "@/components/trading/PriceChart";
import OrderManagement from "@/components/trading/OrderManagement";
import FilmIPTrading from "@/components/trading/FilmIPTrading";
import RevenueSharing from "@/components/trading/RevenueSharing";
import IPStaking from "@/components/trading/IPStaking";
import FilmAnalytics from "@/components/trading/FilmAnalytics";
import CreatorRoyalties from "@/components/trading/CreatorRoyalties";

const Dex = () => {
  const [ethAmount, setEthAmount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");

  // Mock order book data
  const buyOrders = [
    { price: 1234.50, amount: 12.5, total: 15431.25 },
    { price: 1233.75, amount: 8.2, total: 10116.75 },
    { price: 1232.00, amount: 15.8, total: 19465.60 },
    { price: 1231.25, amount: 22.1, total: 27210.63 },
    { price: 1230.50, amount: 18.7, total: 23010.35 },
  ];

  const sellOrders = [
    { price: 1245.75, amount: 10.3, total: 12831.23 },
    { price: 1246.50, amount: 14.7, total: 18323.55 },
    { price: 1247.25, amount: 9.8, total: 12223.05 },
    { price: 1248.00, amount: 16.2, total: 20217.60 },
    { price: 1248.75, amount: 12.9, total: 16108.88 },
  ];

  const handleSwap = () => {
    if (!window.ethereum) {
      toast.error("MetaMask not found", {
        description: "Please install MetaMask to use this feature",
      });
      return;
    }

    toast.success("Swap initiated", {
      description: "Please confirm the transaction in your wallet",
    });
  };

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-4xl font-bold mb-4">RWA Trading Exchange</h1>
          <p className="text-foreground/70 max-w-3xl">
            Trade tokenized real-world assets with advanced trading tools, deep liquidity pools, and real-time market data.
          </p>
        </div>

        {/* Trading Interface */}
        <Tabs defaultValue="trade" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="trade" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Trade
            </TabsTrigger>
            <TabsTrigger value="pools" className="gap-2">
              <Zap className="w-4 h-4" />
              Liquidity
            </TabsTrigger>
            <TabsTrigger value="swap" className="gap-2">
              <ArrowDownUp className="w-4 h-4" />
              Simple Swap
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ChartBar className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="film-ip" className="gap-2">
              <Film className="w-4 h-4" />
              Film IP
            </TabsTrigger>
            <TabsTrigger value="revenue" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="staking" className="gap-2">
              <Lock className="w-4 h-4" />
              Staking
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="royalties" className="gap-2">
              <Crown className="w-4 h-4" />
              Royalties
            </TabsTrigger>
          </TabsList>

          {/* Advanced Trading Interface */}
          <TabsContent value="trade">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Price Chart - Takes up most space */}
              <div className="xl:col-span-8">
                <PriceChart />
              </div>
              
              {/* Trading Form */}
              <div className="xl:col-span-4">
                <TradingForm />
              </div>
              
              {/* Order Book */}
              <div className="xl:col-span-6">
                <OrderBook buyOrders={buyOrders} sellOrders={sellOrders} />
              </div>
              
              {/* Market Info */}
              <div className="xl:col-span-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-muted-foreground">24h High</div>
                          <div className="text-lg font-semibold">$1,267.45</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">24h Low</div>
                          <div className="text-lg font-semibold">$1,198.32</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Market Cap</div>
                          <div className="text-lg font-semibold">$45.2M</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-muted-foreground">24h Volume</div>
                          <div className="text-lg font-semibold">$2.45M</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Circulating Supply</div>
                          <div className="text-lg font-semibold">36,348</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Total Supply</div>
                          <div className="text-lg font-semibold">50,000</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Liquidity Pools */}
          <TabsContent value="pools">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LiquidityPools />
              <Card>
                <CardHeader>
                  <CardTitle>Pool Analytics</CardTitle>
                  <CardDescription>Your liquidity positions and rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Total Liquidity Provided</span>
                        <span className="font-semibold">$15,240</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Unclaimed Rewards</span>
                        <span className="font-semibold text-green-600">$127.45</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Average APR</span>
                        <span className="font-semibold">11.8%</span>
                      </div>
                    </div>
                    <Button className="w-full">
                      Claim All Rewards
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Simple Swap Interface */}
          <TabsContent value="swap">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <Card className="border border-border/50 bg-background/50 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Token Swap</CardTitle>
                    <CardDescription>Exchange ETH for HLN tokens or trade RWA assets</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">You Pay</label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.0"
                          value={ethAmount}
                          onChange={(e) => {
                            setEthAmount(e.target.value);
                            setTokenAmount((parseFloat(e.target.value) * 1000).toString());
                          }}
                          className="pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium">
                          ETH
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <ArrowDownUp className="text-accent" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">You Receive</label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.0"
                          value={tokenAmount}
                          onChange={(e) => {
                            setTokenAmount(e.target.value);
                            setEthAmount((parseFloat(e.target.value) / 1000).toString());
                          }}
                          className="pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium">
                          HLN
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full gap-2" 
                      onClick={handleSwap}
                      disabled={!ethAmount || !tokenAmount}
                    >
                      <Wallet className="w-4 h-4" />
                      Swap Tokens
                    </Button>
                  </CardFooter>
                </Card>

                {/* Market Stats */}
                <Card className="border border-border/50 bg-background/50 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Market Statistics</CardTitle>
                    <CardDescription>Real-time market metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    {marketStats.map((stat, index) => (
                      <div key={index} className="p-4 rounded-lg bg-background/50">
                        <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                        <div className="text-xl font-bold">{stat.value}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Trading Information */}
              <div className="space-y-8">
                <Card className="border border-border/50 bg-background/50 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Trading Guide</CardTitle>
                    <CardDescription>Learn how to trade on our DEX</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tradingSteps.map((step, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">{step.title}</h3>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border/50 bg-background/50 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle>Trading Benefits</CardTitle>
                    <CardDescription>Why trade on our DEX?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Info className="w-5 h-5 text-accent mt-1" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Order Management */}
          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>

          {/* Film IP Trading */}
          <TabsContent value="film-ip">
            <FilmIPTrading />
          </TabsContent>

          {/* Revenue Sharing */}
          <TabsContent value="revenue">
            <RevenueSharing />
          </TabsContent>

          {/* IP Staking */}
          <TabsContent value="staking">
            <IPStaking />
          </TabsContent>

          {/* Film Analytics */}
          <TabsContent value="analytics">
            <FilmAnalytics />
          </TabsContent>

          {/* Creator Royalties */}
          <TabsContent value="royalties">
            <CreatorRoyalties />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const marketStats = [
  { label: "24h Volume", value: "$2.45M" },
  { label: "Market Cap", value: "$45M" },
  { label: "Total Liquidity", value: "$12.8M" },
  { label: "Active Traders", value: "1.2K" }
];

const tradingSteps = [
  {
    title: "Connect Wallet",
    description: "Connect your MetaMask or other Web3 wallet to start trading."
  },
  {
    title: "Complete KYC",
    description: "Verify your identity to access tokenized RWA trading."
  },
  {
    title: "Deposit Funds",
    description: "Add USDC, ETH or other supported tokens to your wallet."
  },
  {
    title: "Start Trading",
    description: "Place orders, provide liquidity, and manage your portfolio."
  }
];

const benefits = [
  "Advanced order types (limit, stop, market)",
  "Deep liquidity pools with competitive spreads",
  "Real-time price charts and market data",
  "Automated yield distribution from RWA assets",
  "Institutional-grade security and compliance",
  "Cross-chain trading capabilities"
];

export default Dex;
