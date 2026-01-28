import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getActiveProposals, getUserVoteAllocations, getVoteByUserAndProposal, calculateVoteResults, getUserVotes } from '@/integrations/supabase/voting';
import type { Proposal, VoteAllocation, Vote, VoteResults } from '@/types/voting';
import VoteButton from '@/components/voting/VoteButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Users, AlertCircle } from 'lucide-react';

interface ProposalWithVoteInfo extends Proposal {
  hasVoted: boolean;
  currentVote?: string;
  results?: VoteResults;
  timeRemaining?: string;
  quorumReached?: boolean;
}

export default function ProposalsList() {
  const { user } = useAuth();
  const [proposals, setProposals] = useState<ProposalWithVoteInfo[]>([]);
  const [filter, setFilter] = useState<'all' | 'voted' | 'unvoted'>('all');
  const [loading, setLoading] = useState(true);

  // Calculate time remaining for a proposal
  const calculateTimeRemaining = (endDate: string): string => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Voting ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  useEffect(() => {
    if (!user) return;

    const fetchProposals = async () => {
      try {
        setLoading(true);
        
        // Fetch active proposals first
        const activeProposals = await getActiveProposals();
        
        if (!activeProposals || activeProposals.length === 0) {
          setProposals([]);
          return;
        }
        
        // Fetch user data only once
        const [userAllocations, userVotes] = await Promise.all([
          getUserVoteAllocations(user.id),
          getUserVotes(user.id)
        ]);
        
        // Create maps for faster lookups
        const allocationMap = new Map(userAllocations.map(alloc => [alloc.proposal_id, alloc]));
        const voteMap = new Map(userVotes.map(vote => [vote.proposal_id, vote]));
        
        // Process proposals in parallel with optimized data fetching
        const proposalsData = await Promise.all(
          activeProposals.map(async (proposal) => {
            try {
              // Get vote results for this proposal (can be cached)
              const results = await calculateVoteResults(proposal.id);
              
              const userVote = voteMap.get(proposal.id);
              const hasAllocation = allocationMap.has(proposal.id);
              
              // Check if quorum is reached
              const quorumReached = proposal.quorum_required ? 
                (results?.total || 0) >= proposal.quorum_required : true;
              
              return {
                ...proposal,
                hasVoted: !!userVote,
                currentVote: userVote?.vote_choice,
                hasAllocation,
                results,
                timeRemaining: calculateTimeRemaining(proposal.end_date),
                quorumReached,
              };
            } catch (error) {
              console.error(`Error processing proposal ${proposal.id}:`, error);
              return {
                ...proposal,
                hasVoted: false,
                currentVote: undefined,
                hasAllocation: false,
                results: undefined,
                timeRemaining: calculateTimeRemaining(proposal.end_date),
                quorumReached: false,
              };
            }
          })
        );

        setProposals(proposalsData);
      } catch (error) {
        console.error('Error fetching proposals:', error);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
    
    // Update time remaining every minute
    const interval = setInterval(() => {
      setProposals(prev => prev.map(proposal => ({
        ...proposal,
        timeRemaining: calculateTimeRemaining(proposal.end_date),
      })));
    }, 60000);

    return () => clearInterval(interval);
  }, [user]);

  const filteredProposals = proposals.filter(p => {
    if (filter === 'voted') return p.hasVoted;
    if (filter === 'unvoted') return !p.hasVoted;
    return true;
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
        Active Proposals
      </h1>
      
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            filter === 'all' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-card/40 hover:bg-card/60 text-foreground'
          }`}
        >
          All Proposals
        </button>
        <button
          onClick={() => setFilter('unvoted')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            filter === 'unvoted' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-card/40 hover:bg-card/60 text-foreground'
          }`}
        >
          Pending Votes
        </button>
        <button
          onClick={() => setFilter('voted')}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            filter === 'voted' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-card/40 hover:bg-card/60 text-foreground'
          }`}
        >
          Voted Proposals
        </button>
      </div>
      
      {filteredProposals.length === 0 ? (
        <div className="text-center py-12 bg-card/40 rounded-lg backdrop-blur-xl border border-border/50">
          <h3 className="text-lg font-medium text-foreground mb-2">
            {filter === 'voted' ? 'No votes yet' : 'No proposals available'}
          </h3>
          <p className="text-muted-foreground">
            {filter === 'voted' 
              ? 'You haven\'t voted on any proposals yet.' 
              : 'There are no active proposals to vote on.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProposals.map((proposal) => (
            <Card key={proposal.id} className="backdrop-blur-xl bg-card/40 border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold mb-2 text-foreground">{proposal.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <Badge variant={proposal.hasVoted ? 'default' : 'secondary'}>
                        {proposal.hasVoted ? 'Voted' : 'Pending'}
                      </Badge>
                      <span className="font-medium">{proposal.timeRemaining}</span>
                      {proposal.quorum_required && (
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          <span>Quorum: {proposal.quorum_required}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">{proposal.description}</p>
                
                {/* Quorum Progress */}
                {proposal.quorum_required && proposal.results && (
                  <div className="bg-card/60 rounded-lg p-4 border border-border/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">Quorum Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {proposal.results.total} / {proposal.quorum_required} votes
                      </span>
                    </div>
                    <Progress 
                      value={(proposal.results.total / proposal.quorum_required) * 100} 
                      className="h-2"
                    />
                  </div>
                )}
                
                {/* Vote Results Visualization */}
                {proposal.results && (
                  <div className="bg-card/60 rounded-lg p-4 border border-border/50">
                    <h4 className="font-semibold mb-3 text-foreground">Current Results</h4>
                    <div className="space-y-3">
                      {Object.entries(proposal.results.results).map(([choice, count]) => (
                        <div key={choice} className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-foreground">{choice}</span>
                            <span className="text-muted-foreground">{count} votes ({proposal.results.percentages[choice]}%)</span>
                          </div>
                          <Progress 
                            value={proposal.results.percentages[choice]} 
                            className="h-2"
                          />
                        </div>
                      ))}
                      <div className="pt-2 text-sm text-muted-foreground">
                        Total Votes: {proposal.results.total}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-border/50">
                  <div className="text-sm text-muted-foreground">
                    {proposal.hasVoted 
                      ? (
                        <span className="text-primary font-medium">
                          You voted: {proposal.currentVote}
                        </span>
                      ) 
                      : 'Waiting for your vote'}
                  </div>
                  <VoteButton
                    proposalId={proposal.id}
                    currentVote={proposal.currentVote}
                    onVoteSuccess={() => {
                      // Refresh proposals
                      window.location.reload();
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
