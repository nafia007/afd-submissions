
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Coins, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface TokenHolding {
  filmId: string;
  filmTitle: string;
  tokensOwned: number;
  totalTokens: number;
  currentValue: number;
  purchasePrice: number;
  profitLoss: number;
  profitLossPercentage: number;
  lastDividend: number;
  totalDividends: number;
}

interface PortfolioStats {
  totalValue: number;
  totalInvested: number;
  totalProfitLoss: number;
  totalDividends: number;
  portfolioPerformance: Array<{ date: string; value: number }>;
}

const InvestmentPortfolio = () => {
  const [holdings, setHoldings] = useState<TokenHolding[]>([]);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real portfolio data from backend
    const fetchPortfolioData = async () => {
      try {
        // TODO: Implement actual data fetching from token_holders and asset_transactions tables
        setHoldings([]);
        setStats({
          totalValue: 0,
          totalInvested: 0,
          totalProfitLoss: 0,
          totalDividends: 0,
          portfolioPerformance: []
        });
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <p className="text-2xl font-bold">${stats.totalInvested.toLocaleString()}</p>
              </div>
              <Coins className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profit/Loss</p>
                <p className={`text-2xl font-bold ${stats.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${stats.totalProfitLoss.toLocaleString()}
                </p>
              </div>
              {stats.totalProfitLoss >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-500" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Dividends</p>
                <p className="text-2xl font-bold text-green-600">${stats.totalDividends.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.portfolioPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Portfolio Value']} />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Token Holdings */}
      <Card>
        <CardHeader>
          <CardTitle>Your Token Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {holdings.map((holding, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{holding.filmTitle}</h4>
                  <div className="flex items-center gap-2">
                    {holding.profitLoss >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`font-medium ${holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {holding.profitLossPercentage > 0 ? '+' : ''}{holding.profitLossPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Tokens Owned</p>
                    <p className="font-medium">{holding.tokensOwned} / {holding.totalTokens}</p>
                    <Badge variant="outline" className="mt-1">
                      {((holding.tokensOwned / holding.totalTokens) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Current Value</p>
                    <p className="font-medium">${holding.currentValue.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Purchase Price</p>
                    <p className="font-medium">${holding.purchasePrice.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Profit/Loss</p>
                    <p className={`font-medium ${holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {holding.profitLoss >= 0 ? '+' : ''}${holding.profitLoss.toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-muted-foreground">Total Dividends</p>
                    <p className="font-medium text-green-600">${holding.totalDividends.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Last: ${holding.lastDividend}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentPortfolio;
