
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Unlock, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface StakingPool {
  filmId: string;
  filmTitle: string;
  apr: number;
  totalStaked: number;
  userStaked: number;
  lockPeriod: number;
  rewardsEarned: number;
  nextRewardDate: string;
  poolCapacity: number;
}

const IPStaking = () => {
  const [stakeAmount, setStakeAmount] = useState("");
  
  const stakingPools: StakingPool[] = [
    {
      filmId: "1",
      filmTitle: "Neon Dreams",
      apr: 18.5,
      totalStaked: 450000,
      userStaked: 12500,
      lockPeriod: 90,
      rewardsEarned: 2340,
      nextRewardDate: "2024-02-01",
      poolCapacity: 500000
    },
    {
      filmId: "2", 
      filmTitle: "Urban Legends",
      apr: 22.3,
      totalStaked: 380000,
      userStaked: 8900,
      lockPeriod: 180,
      rewardsEarned: 1890,
      nextRewardDate: "2024-02-15",
      poolCapacity: 600000
    },
    {
      filmId: "3",
      filmTitle: "The Last Garden",
      apr: 15.7,
      totalStaked: 290000,
      userStaked: 0,
      lockPeriod: 60,
      rewardsEarned: 0,
      nextRewardDate: "2024-02-01",
      poolCapacity: 400000
    }
  ];

  const handleStake = (filmId: string) => {
    const pool = stakingPools.find(p => p.filmId === filmId);
    toast.success("Tokens staked successfully", {
      description: `Staked ${stakeAmount} tokens in "${pool?.filmTitle}" pool`,
    });
    setStakeAmount("");
  };

  const handleUnstake = (filmId: string) => {
    const pool = stakingPools.find(p => p.filmId === filmId);
    toast.success("Unstaking initiated", {
      description: `Unstaking ${pool?.userStaked} tokens from "${pool?.filmTitle}"`,
    });
  };

  const handleClaimRewards = (filmId: string) => {
    const pool = stakingPools.find(p => p.filmId === filmId);
    toast.success("Rewards claimed", {
      description: `Claimed ${pool?.rewardsEarned} tokens from "${pool?.filmTitle}"`,
    });
  };

  const totalStakedValue = stakingPools.reduce((sum, pool) => sum + pool.userStaked, 0);
  const totalRewards = stakingPools.reduce((sum, pool) => sum + pool.rewardsEarned, 0);

  return (
    <div className="space-y-6">
      {/* Staking Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Film IP Staking Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Staked</div>
              <div className="text-2xl font-bold text-blue-600">
                ${totalStakedValue.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Pending Rewards</div>
              <div className="text-2xl font-bold text-green-600">
                ${totalRewards.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="text-sm text-muted-foreground">Average APR</div>
              <div className="text-2xl font-bold text-purple-600">
                {stakingPools.reduce((sum, pool) => sum + pool.apr, 0) / stakingPools.length}%
              </div>
            </div>
          </div>

          {totalRewards > 0 && (
            <div className="mt-4 p-4 bg-muted/20 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Total Pending Rewards</div>
                  <div className="text-sm text-muted-foreground">Claim all available rewards</div>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  Claim All ${totalRewards}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Staking Pools */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Pools</TabsTrigger>
          <TabsTrigger value="my-stakes">My Stakes</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <div className="space-y-4">
            {stakingPools.map((pool) => (
              <Card key={pool.filmId} className="border border-border/50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{pool.filmTitle}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {pool.apr}% APR
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Calendar className="w-3 h-3" />
                          {pool.lockPeriod} days lock
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Pool Utilization</div>
                      <div className="font-semibold">
                        {((pool.totalStaked / pool.poolCapacity) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Pool Capacity</span>
                        <span>${pool.totalStaked.toLocaleString()} / ${pool.poolCapacity.toLocaleString()}</span>
                      </div>
                      <Progress value={(pool.totalStaked / pool.poolCapacity) * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Staked</span>
                        <div className="font-medium">${pool.totalStaked.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Your Stake</span>
                        <div className="font-medium">${pool.userStaked.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Next Reward</span>
                        <div className="font-medium">{pool.nextRewardDate}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Amount to stake"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleStake(pool.filmId)}
                        disabled={!stakeAmount}
                      >
                        Stake
                      </Button>
                      {pool.userStaked > 0 && (
                        <Button 
                          variant="outline"
                          onClick={() => handleUnstake(pool.filmId)}
                        >
                          Unstake
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-stakes" className="mt-4">
          <div className="space-y-4">
            {stakingPools.filter(pool => pool.userStaked > 0).map((pool) => (
              <Card key={pool.filmId} className="border border-border/50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{pool.filmTitle}</h3>
                      <div className="text-sm text-muted-foreground">
                        Staked: ${pool.userStaked.toLocaleString()} • {pool.lockPeriod} days remaining
                      </div>
                    </div>
                    {pool.rewardsEarned > 0 && (
                      <Button 
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleClaimRewards(pool.filmId)}
                      >
                        Claim ${pool.rewardsEarned}
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Stake Value</div>
                      <div className="font-semibold">${pool.userStaked.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">APR</div>
                      <div className="font-semibold text-green-600">{pool.apr}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Rewards Earned</div>
                      <div className="font-semibold text-green-600">${pool.rewardsEarned}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Next Reward</div>
                      <div className="font-semibold">{pool.nextRewardDate}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IPStaking;
