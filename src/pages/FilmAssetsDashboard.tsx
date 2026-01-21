
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Database } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface TokenStats {
  totalValue: number;
  weeklyVolume: number;
  activeHolders: number;
}

const FilmAssetsDashboard = () => {
  const { data: films, isLoading } = useQuery({
    queryKey: ['films'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('films')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: assetStats, isLoading: loadingStats } = useQuery({
    queryKey: ['asset-stats'],
    queryFn: async () => {
      const { data: assets, error } = await supabase
        .from('assets')
        .select('total_value, created_at')
        .eq('status', 'active');
      
      if (error) throw error;
      
      const totalValue = assets?.reduce((sum, asset) => sum + Number(asset.total_value), 0) || 0;
      const weeklyVolume = 0; // This would come from actual transaction data
      const activeHolders = 0; // This would come from token_holders table count
      
      return {
        totalValue,
        weeklyVolume, 
        activeHolders
      } as TokenStats;
    }
  });

  const tokenStats = assetStats || {
    totalValue: 0,
    weeklyVolume: 0,
    activeHolders: 0
  };

  const chartData = films?.slice(0, 5).map(film => ({
    name: film.title.length > 10 ? film.title.substring(0, 10) + '...' : film.title,
    value: parseFloat(film.price.replace('$', '').replace(',', '')) || 0
  })) || [];

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-heading text-4xl font-bold mb-4">Film Assets Dashboard</h1>
          <p className="text-foreground/70 max-w-2xl">
            Track and analyze tokenized film assets performance and market activity.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${tokenStats.totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total value of tokenized film assets
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Trading Volume</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${tokenStats.weeklyVolume.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Volume traded in the past 7 days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Token Holders</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tokenStats.activeHolders}</div>
              <p className="text-xs text-muted-foreground">
                Number of unique token holders
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Market Activity Chart */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Market Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ChartContainer
                config={{
                  value: {
                    color: "hsl(var(--primary))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload) return null;
                        return (
                          <ChartTooltipContent>
                            {payload.map((data, index) => (
                              <div key={index}>
                                <span className="font-bold">{data.name}</span>: $
                                {data.value?.toLocaleString()}
                              </div>
                            ))}
                          </ChartTooltipContent>
                        );
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="currentColor"
                      className="fill-primary"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Films Table */}
        <Card>
          <CardHeader>
            <CardTitle>Tokenized Films</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">Title</th>
                    <th className="p-4 text-left font-medium">Director</th>
                    <th className="p-4 text-left font-medium">Token Price</th>
                    <th className="p-4 text-left font-medium">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center">Loading films data...</td>
                    </tr>
                  ) : films?.map((film) => (
                    <tr key={film.id} className="border-b">
                      <td className="p-4">{film.title}</td>
                      <td className="p-4">{film.director}</td>
                      <td className="p-4">{film.price}</td>
                      <td className="p-4">-</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FilmAssetsDashboard;
