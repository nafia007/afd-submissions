
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Building, TrendingUp, DollarSign } from "lucide-react";

interface AssetPortfolioProps {
  assets: any[];
}

const AssetPortfolio = ({ assets }: AssetPortfolioProps) => {
  // Mock data for portfolio visualization
  const assetTypeData = [
    { name: "Real Estate", value: 45, color: "#3b82f6" },
    { name: "Film Assets", value: 30, color: "#10b981" },
    { name: "Commodities", value: 15, color: "#f59e0b" },
    { name: "Art & Collectibles", value: 10, color: "#ef4444" },
  ];

  const performanceData = [
    { month: "Jan", yield: 4.2, value: 150000 },
    { month: "Feb", yield: 5.1, value: 165000 },
    { month: "Mar", yield: 4.8, value: 172000 },
    { month: "Apr", yield: 5.5, value: 185000 },
    { month: "May", yield: 6.2, value: 195000 },
    { month: "Jun", yield: 5.8, value: 210000 },
  ];

  const topPerformingAssets = assets.slice(0, 3).map((asset, index) => ({
    name: asset.title,
    yield: (6.5 - index * 0.5).toFixed(1),
    value: (150000 + index * 25000).toLocaleString(),
    change: index === 0 ? "+12.3%" : index === 1 ? "+8.7%" : "+5.2%"
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Portfolio Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {assetTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {assetTypeData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="yield" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Assets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Top Performing Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformingAssets.map((asset, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{asset.name}</h4>
                  <p className="text-sm text-muted-foreground">Current Value: ${asset.value}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">
                    {asset.yield}% Yield
                  </Badge>
                  <p className="text-sm font-medium text-green-600">{asset.change}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Asset Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Portfolio Value</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">$1,247,500</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={78} className="flex-1" />
              <span className="text-sm text-green-600">+12.4%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Monthly Yield Earned</span>
              <DollarSign className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">$6,847</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={65} className="flex-1" />
              <span className="text-sm text-blue-600">5.8% APY</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Investments</span>
              <Building className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">{assets.length}</div>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={45} className="flex-1" />
              <span className="text-sm text-purple-600">Diversified</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssetPortfolio;
