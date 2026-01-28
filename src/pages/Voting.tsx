import { useEffect, useState } from 'react';
import ProposalsList from '@/components/voting/ProposalsList';
import { Activity, BarChart3, Clock, Users, Target, Award, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getActiveProposals, getProposals, getVotesByProposal } from '@/integrations/supabase/voting';

export default function Voting() {
  const [stats, setStats] = useState({
    activeProposals: 0,
    totalVoters: 0,
    totalVotes: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch active proposals count
        const activeProposals = await getActiveProposals();
        const activeCount = activeProposals.length;

        // Fetch all proposals and votes to calculate total voters and votes
        const allProposals = await getProposals();
        let totalVotes = 0;
        const uniqueVoters = new Set<string>();

        for (const proposal of allProposals) {
          const votes = await getVotesByProposal(proposal.id);
          totalVotes += votes.length;
          votes.forEach(vote => uniqueVoters.add(vote.user_id));
        }

        setStats({
          activeProposals: activeCount,
          totalVoters: uniqueVoters.size,
          totalVotes: totalVotes,
        });
      } catch (error) {
        console.error('Error fetching voting statistics:', error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Community Governance</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Voting Platform
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cast your vote on important proposals that shape our community. Your voice matters in 
            deciding the future of our platform.
          </p>
        </div>

        {/* Voting Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="backdrop-blur-xl bg-card/40 border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Active Proposals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {loadingStats ? '...' : stats.activeProposals}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Proposals open for voting</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-card/40 border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Total Voters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {loadingStats ? '...' : stats.totalVoters}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Community members voting</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-card/40 border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Total Votes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {loadingStats ? '...' : stats.totalVotes}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Votes cast across proposals</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-card/40 border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Voting Power
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                100
              </div>
              <p className="text-sm text-muted-foreground mt-1">Your current voting weight</p>
            </CardContent>
          </Card>
        </div>

        {/* Voting Guide Section */}
        <div className="mb-12">
          <Card className="backdrop-blur-xl bg-card/40 border-2 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                How Voting Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-xl">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Review Proposals</h3>
                  <p className="text-sm text-muted-foreground">Carefully read through all active proposals and understand the details</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-xl">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Cast Your Vote</h3>
                  <p className="text-sm text-muted-foreground">Select your preferred option and submit your vote before the deadline</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-xl">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Track Results</h3>
                  <p className="text-sm text-muted-foreground">Monitor voting progress and see the outcome once the proposal closes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Proposals List */}
        <ProposalsList />
      </div>
    </div>
  );
}
