
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Globe, Star, Calendar, DollarSign } from "lucide-react";

interface FilmMetrics {
  filmId: string;
  title: string;
  boxOfficeRevenue: number;
  streamingRevenue: number;
  merchandisingRevenue: number;
  internationalRevenue: number;
  audienceScore: number;
  criticScore: number;
  socialMediaMentions: number;
  viewershipGrowth: number;
  demographicData: {
    age18_24: number;
    age25_34: number;
    age35_44: number;
    age45_54: number;
    age55plus: number;
  };
  geographicPerformance: {
    region: string;
    revenue: number;
    growth: number;
  }[];
  weeklyPerformance: {
    week: string;
    revenue: number;
    viewers: number;
  }[];
}

const FilmAnalytics = () => {
  const filmMetrics: FilmMetrics[] = [
    {
      filmId: "1",
      title: "Neon Dreams",
      boxOfficeRevenue: 1200000,
      streamingRevenue: 850000,
      merchandisingRevenue: 280000,
      internationalRevenue: 120000,
      audienceScore: 87,
      criticScore: 82,
      socialMediaMentions: 45000,
      viewershipGrowth: 15.3,
      demographicData: {
        age18_24: 32,
        age25_34: 28,
        age35_44: 22,
        age45_54: 12,
        age55plus: 6
      },
      geographicPerformance: [
        { region: "North America", revenue: 1500000, growth: 12.4 },
        { region: "Europe", revenue: 800000, growth: 8.7 },
        { region: "Asia Pacific", revenue: 350000, growth: 25.1 },
        { region: "Latin America", revenue: 200000, growth: 18.9 }
      ],
      weeklyPerformance: [
        { week: "Week 1", revenue: 450000, viewers: 125000 },
        { week: "Week 2", revenue: 380000, viewers: 98000 },
        { week: "Week 3", revenue: 320000, viewers: 87000 },
        { week: "Week 4", revenue: 290000, viewers: 78000 },
        { week: "Week 5", revenue: 270000, viewers: 72000 },
        { week: "Week 6", revenue: 240000, viewers: 65000 }
      ]
    }
  ];

  const selectedFilm = filmMetrics[0];
  const revenueData = [
    { source: "Box Office", amount: selectedFilm.boxOfficeRevenue, color: "#3b82f6" },
    { source: "Streaming", amount: selectedFilm.streamingRevenue, color: "#10b981" },
    { source: "Merchandising", amount: selectedFilm.merchandisingRevenue, color: "#f59e0b" },
    { source: "International", amount: selectedFilm.internationalRevenue, color: "#ef4444" }
  ];

  const demographicData = Object.entries(selectedFilm.demographicData).map(([age, percentage]) => ({
    age: age.replace('age', '').replace('plus', '+'),
    percentage
  }));

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Film Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">Total Revenue</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                ${(selectedFilm.boxOfficeRevenue + selectedFilm.streamingRevenue + selectedFilm.merchandisingRevenue + selectedFilm.internationalRevenue).toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-muted-foreground">Growth Rate</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                +{selectedFilm.viewershipGrowth}%
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">Audience Score</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {selectedFilm.audienceScore}/100
              </div>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-muted-foreground">Social Mentions</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {(selectedFilm.socialMediaMentions / 1000).toFixed(1)}K
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
          <TabsTrigger value="performance">Weekly Performance</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ source, percentage }) => `${source}: ${percentage}%`}
                    >
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Streams Detail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData.map((stream, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{stream.source}</span>
                        <span className="font-semibold">${stream.amount.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(stream.amount / Math.max(...revenueData.map(r => r.amount))) * 100} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={selectedFilm.weeklyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="viewers" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Viewers"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={demographicData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedFilm.geographicPerformance.map((region, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{region.region}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={region.growth > 15 ? "default" : "secondary"}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +{region.growth}%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Revenue: ${region.revenue.toLocaleString()}</span>
                      <span>Growth: {region.growth}%</span>
                    </div>
                    <Progress value={(region.revenue / 1500000) * 100} className="h-2 mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FilmAnalytics;
