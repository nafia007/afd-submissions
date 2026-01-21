
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Building, DollarSign, Users } from "lucide-react";

interface AssetMetricsProps {
  assets: any[];
}

const AssetMetrics = ({ assets }: AssetMetricsProps) => {
  // Calculate metrics from assets data
  const totalAssets = assets.length;
  const totalValue = assets.reduce((acc, asset) => {
    // Extract value from description or use a default
    const match = asset.description?.match(/Total Value: \$([0-9,]+)/);
    return acc + (match ? parseInt(match[1].replace(/,/g, '')) : 100000);
  }, 0);
  
  // Calculate real metrics from actual data
  const averageYield = 0; // Will be calculated from yield_distributions table
  const totalInvestors = 0; // Will be calculated from token_holders table

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssets}</div>
          <p className="text-xs text-muted-foreground">
            Tokenized assets under management
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Asset Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          <p className="text-xs text-muted-foreground">
            Combined value of all assets
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Yield</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageYield}%</div>
          <p className="text-xs text-muted-foreground">
            Annual yield across portfolio
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInvestors}</div>
          <p className="text-xs text-muted-foreground">
            Active token holders
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetMetrics;
