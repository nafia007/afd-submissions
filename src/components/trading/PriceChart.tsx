
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PriceChart = () => {
  const chartData = [
    { time: "09:00", price: 1200, volume: 145000 },
    { time: "10:00", price: 1215, volume: 162000 },
    { time: "11:00", price: 1208, volume: 138000 },
    { time: "12:00", price: 1225, volume: 175000 },
    { time: "13:00", price: 1235, volume: 189000 },
    { time: "14:00", price: 1242, volume: 156000 },
    { time: "15:00", price: 1238, volume: 143000 },
    { time: "16:00", price: 1245, volume: 167000 },
  ];

  const currentPrice = 1245;
  const priceChange = 45;
  const percentChange = 3.74;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>RWA-REAL/USDC</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-2xl font-bold">${currentPrice.toFixed(2)}</span>
              <Badge variant={priceChange >= 0 ? "default" : "destructive"} className="gap-1">
                {priceChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)} ({percentChange >= 0 ? "+" : ""}{percentChange.toFixed(2)}%)
              </Badge>
            </div>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div>24h Volume</div>
            <div className="font-medium text-foreground">$2.45M</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <YAxis 
                domain={['dataMin - 10', 'dataMax + 10']}
                axisLine={false}
                tickLine={false}
                className="text-xs"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
