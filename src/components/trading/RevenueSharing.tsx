
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Calendar, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";

interface RevenueStream {
  source: string;
  amount: number;
  percentage: number;
  growth: number;
}

interface FilmRevenue {
  filmId: string;
  title: string;
  totalRevenue: number;
  yourShare: number;
  ownershipPercentage: number;
  lastPayout: string;
  nextPayout: string;
  streams: RevenueStream[];
  pendingAmount: number;
}

const RevenueSharing = () => {
  const filmRevenues: FilmRevenue[] = [
    {
      filmId: "1",
      title: "Neon Dreams",
      totalRevenue: 2450000,
      yourShare: 56350,
      ownershipPercentage: 2.3,
      lastPayout: "2024-01-15",
      nextPayout: "2024-02-15",
      pendingAmount: 1250,
      streams: [
        { source: "Box Office", amount: 1200000, percentage: 49, growth: 5.2 },
        { source: "Streaming", amount: 850000, percentage: 35, growth: 12.8 },
        { source: "Merchandising", amount: 280000, percentage: 11, growth: 8.4 },
        { source: "International Sales", amount: 120000, percentage: 5, growth: 15.6 }
      ]
    },
    {
      filmId: "2",
      title: "Urban Legends",
      totalRevenue: 3890000,
      yourShare: 159490,
      ownershipPercentage: 4.1,
      lastPayout: "2024-01-15",
      nextPayout: "2024-02-15",
      pendingAmount: 3420,
      streams: [
        { source: "Box Office", amount: 1950000, percentage: 50, growth: 8.1 },
        { source: "Streaming", amount: 1170000, percentage: 30, growth: 18.5 },
        { source: "TV Rights", amount: 580000, percentage: 15, growth: 6.2 },
        { source: "Gaming Rights", amount: 190000, percentage: 5, growth: 25.3 }
      ]
    }
  ];

  const handleClaimRevenue = (filmId: string) => {
    const film = filmRevenues.find(f => f.filmId === filmId);
    toast.success("Revenue claimed", {
      description: `Claimed $${film?.pendingAmount} from "${film?.title}"`,
    });
  };

  const totalPendingRevenue = filmRevenues.reduce((sum, film) => sum + film.pendingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Revenue Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Revenue Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Earned</div>
              <div className="text-2xl font-bold text-green-600">
                ${filmRevenues.reduce((sum, film) => sum + film.yourShare, 0).toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Pending Payout</div>
              <div className="text-2xl font-bold text-blue-600">
                ${totalPendingRevenue.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Active Films</div>
              <div className="text-2xl font-bold text-purple-600">
                {filmRevenues.length}
              </div>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Avg Monthly</div>
              <div className="text-2xl font-bold text-orange-600">
                ${Math.round(filmRevenues.reduce((sum, film) => sum + film.pendingAmount, 0) * 12).toLocaleString()}
              </div>
            </div>
          </div>
          
          {totalPendingRevenue > 0 && (
            <div className="mt-4 p-4 bg-muted/20 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Total Pending Revenue</div>
                  <div className="text-sm text-muted-foreground">Next payout: February 15, 2024</div>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  Claim ${totalPendingRevenue}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Film Revenue */}
      <div className="space-y-4">
        {filmRevenues.map((film) => (
          <Card key={film.filmId}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{film.title}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {film.ownershipPercentage}% ownership • ${film.yourShare.toLocaleString()} total earned
                  </div>
                </div>
                {film.pendingAmount > 0 && (
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleClaimRevenue(film.filmId)}
                  >
                    Claim ${film.pendingAmount}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Last Payout:</span>
                    <span className="ml-2 font-medium">{film.lastPayout}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Next Payout:</span>
                    <span className="ml-2 font-medium">{film.nextPayout}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Revenue Streams</span>
                    <span className="text-sm text-muted-foreground">
                      Total: ${film.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {film.streams.map((stream, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <span>{stream.source}</span>
                            <Badge variant="outline" className="text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              +{stream.growth}%
                            </Badge>
                          </div>
                          <span className="font-medium">${stream.amount.toLocaleString()}</span>
                        </div>
                        <Progress value={stream.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RevenueSharing;
