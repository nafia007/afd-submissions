
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign } from "lucide-react";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

export default function Analytics() {
  const { isAdmin, loading } = useAdminCheck();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }
  // Fetch real data from Supabase
  const { data: assetCount, isLoading: loadingAssets } = useQuery({
    queryKey: ['asset-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from("assets")
        .select("*", { count: "exact", head: true });
      return count || 0;
    }
  });

  const { data: userCount, isLoading: loadingUsers } = useQuery({
    queryKey: ['user-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      return count || 0;
    }
  });

  const { data: filmsCount, isLoading: loadingFilms } = useQuery({
    queryKey: ['films-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from("films")
        .select("*", { count: "exact", head: true });
      return count || 0;
    }
  });

  const { data: postsCount, isLoading: loadingPosts } = useQuery({
    queryKey: ['posts-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true });
      return count || 0;
    }
  });

  const { data: recentTransactions, isLoading: loadingTransactions } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const { data } = await supabase
        .from("asset_transactions")
        .select("total_amount, created_at")
        .order("created_at", { ascending: false })
        .limit(10);
      return data || [];
    }
  });

  const { data: assets, isLoading: loadingAssetData } = useQuery({
    queryKey: ['assets-data'],
    queryFn: async () => {
      const { data } = await supabase
        .from("assets")
        .select("asset_type")
        .eq("status", "active");
      return data || [];
    }
  });

  const isLoading = loadingAssets || loadingUsers || loadingFilms || loadingPosts || loadingTransactions || loadingAssetData;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16 flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  // Calculate total transaction volume
  const totalVolume = recentTransactions?.reduce((sum, transaction) => sum + Number(transaction.total_amount), 0) || 0;

  // Create monthly data based on real transactions
  const monthlyData = recentTransactions?.reduce((acc, transaction) => {
    const month = new Date(transaction.created_at).toLocaleDateString('en-US', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.volume += Number(transaction.total_amount);
    } else {
      acc.push({ month, volume: Number(transaction.total_amount) });
    }
    return acc;
  }, [] as { month: string; volume: number }[]) || [];

  // Asset type distribution from real data
  const assetTypeDistribution = assets?.reduce((acc, asset) => {
    const type = asset.asset_type;
    const existing = acc.find(item => item.name === type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: type, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]) || [];

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <h1 className="text-4xl font-heading font-bold mb-8 flex gap-2 items-center">
        <TrendingUp className="w-7 h-7 text-primary" /> Analytics Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetCount}</div>
            <p className="text-xs text-muted-foreground">Tokenized assets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Films Listed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filmsCount}</div>
            <p className="text-xs text-muted-foreground">Films on platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trading Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalVolume.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Recent transactions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {monthlyData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trading Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Volume"]} />
                    <Bar dataKey="volume" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {assetTypeDistribution.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Asset Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={assetTypeDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius="80%"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {assetTypeDistribution.map((entry, idx) => (
                        <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Assets"]} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Community Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Posts</span>
                <span className="font-semibold">{postsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="font-semibold">{userCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Recent Transactions</span>
                <span className="font-semibold">{recentTransactions?.length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
