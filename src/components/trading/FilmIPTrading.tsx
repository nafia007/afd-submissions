import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, TrendingUp, Users, DollarSign, Calendar, Globe } from "lucide-react";
import { toast } from "sonner";

interface FilmIPAsset {
  id: string;
  title: string;
  genre: string;
  releaseDate: string;
  totalTokens: number;
  availableTokens: number;
  currentPrice: number;
  dailyRevenue: number;
  totalRevenue: number;
  revenueGrowth: number;
  ownershipPercentage: number;
  ipRights: string[];
}

const FilmIPTrading = () => {
  const filmAssets: FilmIPAsset[] = [
    {
      id: "1",
      title: "Neon Dreams",
      genre: "Sci-Fi Thriller",
      releaseDate: "2024-06-15",
      totalTokens: 100000,
      availableTokens: 15420,
      currentPrice: 12.45,
      dailyRevenue: 8450,
      totalRevenue: 2450000,
      revenueGrowth: 8.7,
      ownershipPercentage: 2.3,
      ipRights: ["Streaming", "Merchandising", "Sequel Rights"]
    },
    {
      id: "2",
      title: "Urban Legends",
      genre: "Horror",
      releaseDate: "2024-03-22",
      totalTokens: 75000,
      availableTokens: 8930,
      currentPrice: 18.20,
      dailyRevenue: 12300,
      totalRevenue: 3890000,
      revenueGrowth: 15.2,
      ownershipPercentage: 4.1,
      ipRights: ["Global Distribution", "TV Rights", "Gaming Rights"]
    },
    {
      id: "3",
      title: "The Last Garden",
      genre: "Drama",
      releaseDate: "2024-01-10",
      totalTokens: 50000,
      availableTokens: 5200,
      currentPrice: 24.80,
      dailyRevenue: 6750,
      totalRevenue: 5200000,
      revenueGrowth: 3.4,
      ownershipPercentage: 1.8,
      ipRights: ["Streaming", "International Sales"]
    }
  ];

  const handleTrade = (filmId: string, action: "buy" | "sell") => {
    const film = filmAssets.find(f => f.id === filmId);
    toast.success(`${action} order placed`, {
      description: `Film IP token order for "${film?.title}" has been submitted`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="w-5 h-5" />
            Film IP Assets Trading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="marketplace" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="marketplace">IP Marketplace</TabsTrigger>
              <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
              <TabsTrigger value="analytics">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="marketplace" className="mt-4">
              <div className="space-y-4">
                {filmAssets.map((film) => (
                  <Card key={film.id} className="border border-border/50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{film.title}</h3>
                          <p className="text-sm text-muted-foreground">{film.genre} • Released {film.releaseDate}</p>
                        </div>
                        <Badge variant={film.revenueGrowth > 10 ? "default" : "secondary"}>
                          {film.revenueGrowth > 0 ? "+" : ""}{film.revenueGrowth}% growth
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Token Price</div>
                          <div className="font-semibold">${film.currentPrice}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Available</div>
                          <div className="font-semibold">{film.availableTokens.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Daily Revenue</div>
                          <div className="font-semibold text-green-600">${film.dailyRevenue.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Total Revenue</div>
                          <div className="font-semibold">${(film.totalRevenue / 1000000).toFixed(1)}M</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm text-muted-foreground mb-2">IP Rights Included</div>
                        <div className="flex flex-wrap gap-2">
                          {film.ipRights.map((right, index) => (
                            <Badge key={index} variant="outline" className="gap-1">
                              <Globe className="w-3 h-3" />
                              {right}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleTrade(film.id, "buy")}
                        >
                          Buy Tokens
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleTrade(film.id, "sell")}
                        >
                          Sell Tokens
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="mt-4">
              <div className="space-y-4">
                <Card className="border border-border/50">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Your Film IP Holdings</h3>
                    <div className="space-y-3">
                      {filmAssets.filter(film => film.ownershipPercentage > 0).map((film) => (
                        <div key={film.id} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                          <div>
                            <div className="font-medium">{film.title}</div>
                            <div className="text-sm text-muted-foreground">{film.ownershipPercentage}% ownership</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${(film.currentPrice * film.totalTokens * film.ownershipPercentage / 100).toLocaleString()}</div>
                            <div className="text-sm text-green-600">+${(film.dailyRevenue * film.ownershipPercentage / 100).toFixed(2)}/day</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filmAssets.slice(0, 3).map((film) => (
                        <div key={film.id} className="flex justify-between items-center">
                          <span className="text-sm">{film.title}</span>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 font-medium">+{film.revenueGrowth}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Market Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Average Token Price</span>
                        <span className="font-medium">$18.48</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Market Cap</span>
                        <span className="font-medium">$11.2M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">24h Volume</span>
                        <span className="font-medium">$847K</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilmIPTrading;
