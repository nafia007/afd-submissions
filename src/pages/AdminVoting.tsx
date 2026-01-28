import { useState, useEffect } from 'react';
import { getProposals, closeProposal } from '@/integrations/supabase/voting';
import type { Proposal } from '@/types/voting';
import CreateProposal from '@/components/admin/CreateProposal';
import NFTMinting from '@/components/admin/NFTMinting';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, Users, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

export default function AdminVoting() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      const proposalsData = await getProposals();
      setProposals(proposalsData);
      setLoading(false);
    };

    fetchProposals();
  }, []);

  const handleCloseProposal = async (proposalId: string) => {
    if (window.confirm('Are you sure you want to close this proposal?')) {
      const updatedProposal = await closeProposal(proposalId);
      if (updatedProposal) {
        setProposals(proposals.map(p => 
          p.id === proposalId ? updatedProposal : p
        ));
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
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
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Voting Administration
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage voting proposals, track results, and mint NFT proofs
          </p>
        </div>

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="bg-card/40 backdrop-blur-xl">
            <TabsTrigger value="create" className="data-[state=active]:bg-primary text-primary-foreground">
              Create Proposal
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-primary text-primary-foreground">
              Manage Proposals
            </TabsTrigger>
            <TabsTrigger value="mint" className="data-[state=active]:bg-primary text-primary-foreground">
              Mint NFT Proof
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <CreateProposal />
          </TabsContent>

          <TabsContent value="manage">
            <Card className="backdrop-blur-xl bg-card/40 border-2 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  All Proposals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {proposals.length === 0 ? (
                    <div className="text-center py-12 bg-card/60 rounded-lg backdrop-blur-xl border border-border/50">
                      <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="text-lg font-medium text-foreground mb-2">No proposals found</p>
                      <p className="text-muted-foreground">Create your first proposal to get started</p>
                    </div>
                  ) : (
                    proposals.map((proposal) => (
                      <div
                        key={proposal.id}
                        className="flex justify-between items-start p-4 border border-border/50 rounded-lg hover:bg-card/60 transition-all duration-200"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-foreground">{proposal.title}</h3>
                            <Badge variant={proposal.status === 'active' ? 'default' : 'secondary'}>
                              {proposal.status}
                            </Badge>
                            {proposal.nft_minted && (
                              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                NFT Minted
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                            {proposal.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(proposal.start_date).toLocaleDateString()} - {new Date(proposal.end_date).toLocaleDateString()}
                            </span>
                            {proposal.quorum_required && (
                              <span className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                Quorum: {proposal.quorum_required}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {proposal.status === 'active' && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleCloseProposal(proposal.id)}
                              className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Close
                            </Button>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <ExternalLink className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl bg-card/40 backdrop-blur-xl border border-border/50">
                              <h3 className="text-lg font-semibold mb-4 text-foreground">{proposal.title}</h3>
                              <p className="text-muted-foreground mb-4">{proposal.description}</p>
                              <div className="space-y-2 text-sm">
                                <p className="flex justify-between">
                                  <strong>Status:</strong> 
                                  <span className={proposal.status === 'active' ? 'text-green-500' : 'text-muted-foreground'}>
                                    {proposal.status}
                                  </span>
                                </p>
                                <p className="flex justify-between">
                                  <strong>Start Date:</strong> 
                                  <span>{new Date(proposal.start_date).toLocaleString()}</span>
                                </p>
                                <p className="flex justify-between">
                                  <strong>End Date:</strong> 
                                  <span>{new Date(proposal.end_date).toLocaleString()}</span>
                                </p>
                                {proposal.quorum_required && (
                                  <p className="flex justify-between">
                                    <strong>Quorum Required:</strong> 
                                    <span>{proposal.quorum_required}%</span>
                                  </p>
                                )}
                                <p className="flex justify-between">
                                  <strong>Created By:</strong> 
                                  <span>{proposal.created_by}</span>
                                </p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mint">
            <Card className="backdrop-blur-xl bg-card/40 border-2 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Mint NFT Proof
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Select Proposal to Mint NFT
                    </label>
                    <div className="space-y-2">
                      {proposals
                        .filter(p => p.status === 'closed' && !p.nft_minted)
                        .map((proposal) => (
                          <Button
                            key={proposal.id}
                            variant={selectedProposal?.id === proposal.id ? 'default' : 'secondary'}
                            onClick={() => setSelectedProposal(proposal)}
                            className="w-full justify-start"
                          >
                            {proposal.title}
                          </Button>
                        ))}
                    </div>
                    {proposals.filter(p => p.status === 'closed' && !p.nft_minted).length === 0 && (
                      <div className="text-center py-8 bg-card/60 rounded-lg backdrop-blur-xl border border-border/50">
                        <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p className="text-muted-foreground text-sm">
                          No closed proposals available for minting NFT
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedProposal && (
                    <NFTMinting proposalId={selectedProposal.id} />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
