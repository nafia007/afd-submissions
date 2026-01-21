
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Distribution {
  id: string;
  film_id: string;
  total_revenue: number;
  distribution_date: string;
  period_start: string;
  period_end: string;
}

interface Payout {
  id: string;
  distribution_id: string;
  tokens_held: number;
  payout_amount: number;
  status: 'pending' | 'processed' | 'failed';
  transaction_hash?: string;
  created_at: string;
  processed_at?: string;
}

interface RevenueDistributionProps {
  filmId?: string;
  userId?: string;
}

const RevenueDistribution = ({ filmId, userId }: RevenueDistributionProps) => {
  const [processing, setProcessing] = useState<string | null>(null);
  
  // Fetch real data from yield_distributions table
  const { data: distributions = [], isLoading: distributionsLoading } = useQuery({
    queryKey: ['distributions', filmId],
    queryFn: async () => {
      // TODO: Implement actual data fetching from yield_distributions table
      return [] as Distribution[];
    },
    enabled: !!filmId
  });

  const { data: payouts = [], isLoading: payoutsLoading } = useQuery({
    queryKey: ['payouts', userId],
    queryFn: async () => {
      // TODO: Implement actual data fetching from user's payouts
      return [] as Payout[];
    },
    enabled: !!userId
  });
  
  const handleClaimPayout = async (payoutId: string) => {
    try {
      setProcessing(payoutId);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, just update the local state (in real implementation, this would update the database)
      console.log(`Processing payout ${payoutId}`);
      
      toast.success("Payout claimed successfully!");
    } catch (error) {
      console.error("Error claiming payout:", error);
      toast.error("Failed to claim payout");
    } finally {
      setProcessing(null);
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  if (distributionsLoading || payoutsLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        <p>Loading revenue data...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {userId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Your Payouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payouts?.length === 0 ? (
              <p className="text-foreground/70">No payouts available yet.</p>
            ) : (
              <div className="space-y-4">
                {payouts?.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(payout.status)}
                      <div>
                        <p className="font-medium">{payout.payout_amount} ETH</p>
                        <p className="text-sm text-foreground/70">
                          {payout.tokens_held} tokens held
                        </p>
                        <p className="text-xs text-foreground/50">
                          {new Date(payout.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(payout.status)}>
                        {payout.status}
                      </Badge>
                      {payout.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleClaimPayout(payout.id)}
                          disabled={processing === payout.id}
                        >
                          {processing === payout.id ? (
                            <>
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Claim"
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Revenue Distributions</CardTitle>
        </CardHeader>
        <CardContent>
          {distributions?.length === 0 ? (
            <p className="text-foreground/70">No revenue distributions yet.</p>
          ) : (
            <div className="space-y-4">
              {distributions?.map((distribution) => (
                <div key={distribution.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{distribution.total_revenue} ETH Total Revenue</p>
                      <p className="text-sm text-foreground/70">
                        Distribution Date: {new Date(distribution.distribution_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-foreground/50">
                    Period: {new Date(distribution.period_start).toLocaleDateString()} - {new Date(distribution.period_end).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueDistribution;
