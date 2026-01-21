
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, DollarSign, Calendar, TrendingUp, User, Crown } from "lucide-react";
import { toast } from "sonner";

interface CreatorRoyalty {
  creatorId: string;
  name: string;
  role: string;
  avatar: string;
  royaltyPercentage: number;
  totalEarned: number;
  pendingAmount: number;
  lastPayout: string;
  nextPayout: string;
  filmContributions: {
    filmTitle: string;
    contribution: string;
    royaltyShare: number;
  }[];
}

interface RoyaltyPool {
  filmId: string;
  filmTitle: string;
  totalRoyaltyPool: number;
  distributedAmount: number;
  pendingDistribution: number;
  nextDistributionDate: string;
  creators: CreatorRoyalty[];
}

const CreatorRoyalties = () => {
  const royaltyPools: RoyaltyPool[] = [
    {
      filmId: "1",
      filmTitle: "Neon Dreams",
      totalRoyaltyPool: 245000,
      distributedAmount: 189000,
      pendingDistribution: 56000,
      nextDistributionDate: "2024-02-15",
      creators: [
        {
          creatorId: "1",
          name: "Alexandra Chen",
          role: "Director",
          avatar: "photo-1494790108755-2616b612b47c",
          royaltyPercentage: 25,
          totalEarned: 47250,
          pendingAmount: 14000,
          lastPayout: "2024-01-15",
          nextPayout: "2024-02-15",
          filmContributions: [
            { filmTitle: "Neon Dreams", contribution: "Director", royaltyShare: 25 }
          ]
        },
        {
          creatorId: "2",
          name: "Marcus Rodriguez",
          role: "Lead Actor",
          avatar: "photo-1472099645785-5658abf4ff4e",
          royaltyPercentage: 15,
          totalEarned: 28350,
          pendingAmount: 8400,
          lastPayout: "2024-01-15",
          nextPayout: "2024-02-15",
          filmContributions: [
            { filmTitle: "Neon Dreams", contribution: "Lead Actor", royaltyShare: 15 }
          ]
        },
        {
          creatorId: "3",
          name: "Sarah Kim",
          role: "Cinematographer",
          avatar: "photo-1438761681033-6461ffad8d80",
          royaltyPercentage: 8,
          totalEarned: 15120,
          pendingAmount: 4480,
          lastPayout: "2024-01-15",
          nextPayout: "2024-02-15",
          filmContributions: [
            { filmTitle: "Neon Dreams", contribution: "Cinematographer", royaltyShare: 8 }
          ]
        },
        {
          creatorId: "4",
          name: "David Thompson",
          role: "Composer",
          avatar: "photo-1500648767791-00dcc994a43e",
          royaltyPercentage: 5,
          totalEarned: 9450,
          pendingAmount: 2800,
          lastPayout: "2024-01-15",
          nextPayout: "2024-02-15",
          filmContributions: [
            { filmTitle: "Neon Dreams", contribution: "Original Score", royaltyShare: 5 }
          ]
        }
      ]
    }
  ];

  const handleDistributeRoyalties = (filmId: string) => {
    const pool = royaltyPools.find(p => p.filmId === filmId);
    toast.success("Royalties distributed", {
      description: `Distributed $${pool?.pendingDistribution.toLocaleString()} to creators of "${pool?.filmTitle}"`,
    });
  };

  const handleClaimRoyalty = (creatorId: string) => {
    const creator = royaltyPools[0].creators.find(c => c.creatorId === creatorId);
    toast.success("Royalty claimed", {
      description: `${creator?.name} claimed $${creator?.pendingAmount.toLocaleString()}`,
    });
  };

  const selectedPool = royaltyPools[0];
  const totalPending = selectedPool.creators.reduce((sum, creator) => sum + creator.pendingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Royalty Pool Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Creator Royalty Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Pool</div>
              <div className="text-2xl font-bold text-blue-600">
                ${selectedPool.totalRoyaltyPool.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Distributed</div>
              <div className="text-2xl font-bold text-green-600">
                ${selectedPool.distributedAmount.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Pending</div>
              <div className="text-2xl font-bold text-orange-600">
                ${selectedPool.pendingDistribution.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Creators</div>
              <div className="text-2xl font-bold text-purple-600">
                {selectedPool.creators.length}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Distribution Progress</span>
                <span className="text-sm text-muted-foreground">
                  ${selectedPool.distributedAmount.toLocaleString()} / ${selectedPool.totalRoyaltyPool.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={(selectedPool.distributedAmount / selectedPool.totalRoyaltyPool) * 100} 
                className="h-3" 
              />
            </div>

            {selectedPool.pendingDistribution > 0 && (
              <div className="p-4 bg-muted/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Pending Distribution</div>
                    <div className="text-sm text-muted-foreground">
                      Next distribution: {selectedPool.nextDistributionDate}
                    </div>
                  </div>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleDistributeRoyalties(selectedPool.filmId)}
                  >
                    Distribute ${selectedPool.pendingDistribution.toLocaleString()}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Creator Royalties */}
      <Card>
        <CardHeader>
          <CardTitle>Creator Breakdown - {selectedPool.filmTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedPool.creators.map((creator) => (
              <div key={creator.creatorId} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={`https://images.unsplash.com/${creator.avatar}?w=100&h=100&fit=crop&crop=face`} />
                      <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{creator.name}</div>
                      <div className="text-sm text-muted-foreground">{creator.role}</div>
                      <Badge variant="outline" className="mt-1">
                        {creator.royaltyPercentage}% share
                      </Badge>
                    </div>
                  </div>
                  {creator.pendingAmount > 0 && (
                    <Button 
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleClaimRoyalty(creator.creatorId)}
                    >
                      Claim ${creator.pendingAmount.toLocaleString()}
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Royalty Share</div>
                    <div className="font-semibold">{creator.royaltyPercentage}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total Earned</div>
                    <div className="font-semibold">${creator.totalEarned.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                    <div className="font-semibold text-green-600">${creator.pendingAmount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Last Payout</div>
                    <div className="font-semibold">{creator.lastPayout}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-2">Contributions</div>
                  <div className="flex flex-wrap gap-2">
                    {creator.filmContributions.map((contribution, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        <User className="w-3 h-3" />
                        {contribution.contribution}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Royalty Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribution Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                <div>
                  <div className="font-medium">February 2024</div>
                  <div className="text-sm text-muted-foreground">Quarterly Distribution</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${totalPending.toLocaleString()}</div>
                  <div className="text-sm text-green-600">Pending</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <div className="font-medium">November 2023</div>
                  <div className="text-sm text-muted-foreground">Previous Distribution</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">$45,200</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Royalty Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Average per Creator</span>
                <span className="font-medium">
                  ${Math.round(selectedPool.totalRoyaltyPool / selectedPool.creators.length).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Distribution Frequency</span>
                <span className="font-medium">Quarterly</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Revenue Share</span>
                <span className="font-medium">
                  {selectedPool.creators.reduce((sum, creator) => sum + creator.royaltyPercentage, 0)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Next Distribution</span>
                <span className="font-medium">{selectedPool.nextDistributionDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatorRoyalties;
