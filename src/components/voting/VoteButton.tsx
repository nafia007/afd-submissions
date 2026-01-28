import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { submitVote } from '@/integrations/supabase/voting';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface VoteButtonProps {
  proposalId: string;
  currentVote?: string;
  onVoteSuccess?: () => void;
}

export default function VoteButton({ 
  proposalId, 
  currentVote, 
  onVoteSuccess 
}: VoteButtonProps) {
  const { user } = useAuth();
  const [selectedVote, setSelectedVote] = useState(currentVote);
  const [loading, setLoading] = useState(false);

  const handleVote = async (choice: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to cast your vote',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const vote = await submitVote(user.id, proposalId, choice);
      
      if (vote) {
        setSelectedVote(choice);
        toast({
          title: 'Vote Submitted',
          description: `Your vote for "${choice}" has been recorded successfully`,
          variant: 'default',
        });
        onVoteSuccess?.();
      } else {
        toast({
          title: 'Vote Failed',
          description: 'Failed to submit your vote. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while submitting your vote.',
        variant: 'destructive',
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="flex gap-2">
      {['For', 'Against', 'Abstain'].map(choice => (
        <Button
          key={choice}
          onClick={() => handleVote(choice)}
          disabled={loading}
          variant={selectedVote === choice ? 'default' : 'secondary'}
          size="sm"
          className={`transition-all duration-300 ${
            selectedVote === choice 
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
              : 'bg-card/40 hover:bg-card/60 text-foreground'
          }`}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          {choice}
        </Button>
      ))}
    </div>
  );
}
