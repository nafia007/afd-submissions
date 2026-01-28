import { supabase } from './client';
import type { Proposal, Vote, VoteAllocation, VoteResults } from '@/types/voting';

// Type assertion to bypass Supabase type checks for new tables
const supabaseWithTypes = supabase as any;

// Helper function to handle database errors
const handleDatabaseError = (error: any, operation: string) => {
  console.error(`Error ${operation}:`, error);
  
  // Check if this is a table not found error
  if (error?.code === '42P01' || error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
    console.warn(`Voting tables not found. Please run the SQL from create-voting-tables.sql in your Supabase database.`);
  }
  
  return null;
};

// Proposal management
export async function createProposal(
  proposalData: Omit<Proposal, 'id' | 'created_at' | 'nft_minted'>,
  userId: string
): Promise<Proposal | null> {
  const { data, error } = await supabaseWithTypes
    .from('proposals')
    .insert({
      ...proposalData,
      created_by: userId,
      status: 'active',
      nft_minted: false,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating proposal:', error);
    return null;
  }

  return data as unknown as Proposal;
}

export async function getProposals(): Promise<Proposal[]> {
  try {
    const { data, error } = await supabaseWithTypes
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      handleDatabaseError(error, 'getting proposals');
      return [];
    }

    return data as unknown as Proposal[];
  } catch (error) {
    handleDatabaseError(error, 'getting proposals');
    return [];
  }
}

export async function getActiveProposals(): Promise<Proposal[]> {
  const now = new Date().toISOString();
  
  try {
    const { data, error } = await supabaseWithTypes
      .from('proposals')
      .select('*')
      .eq('status', 'active')
      .lt('start_date', now)
      .gt('end_date', now)
      .order('created_at', { ascending: false });

    if (error) {
      handleDatabaseError(error, 'getting active proposals');
      return [];
    }

    return data as unknown as Proposal[];
  } catch (error) {
    handleDatabaseError(error, 'getting active proposals');
    return [];
  }
}

export async function getProposalById(id: string): Promise<Proposal | null> {
  const { data, error } = await supabaseWithTypes
    .from('proposals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error getting proposal:', error);
    return null;
  }

  return data as unknown as Proposal;
}

export async function updateProposal(
  id: string,
  updates: Partial<Proposal>
): Promise<Proposal | null> {
  const { data, error } = await supabaseWithTypes
    .from('proposals')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating proposal:', error);
    return null;
  }

  return data as unknown as Proposal;
}

export async function closeProposal(id: string): Promise<Proposal | null> {
  const { data, error } = await supabaseWithTypes
    .from('proposals')
    .update({
      status: 'closed',
      closed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    console.error('Error closing proposal:', error);
    return null;
  }

  return data as unknown as Proposal;
}

export async function deleteProposal(id: string): Promise<boolean> {
  const { error } = await supabaseWithTypes.from('proposals').delete().eq('id', id);

  if (error) {
    console.error('Error deleting proposal:', error);
    return false;
  }

  return true;
}

// Vote allocation
export async function allocateVotesToUser(userId: string): Promise<void> {
  try {
    const activeProposals = await getActiveProposals();
    
    if (!activeProposals || activeProposals.length === 0) {
      return;
    }

    // Get all existing allocations for this user in one query
    const { data: existingAllocations, error: allocationsError } = await supabaseWithTypes
      .from('vote_allocations')
      .select('proposal_id')
      .eq('user_id', userId)
      .in('proposal_id', activeProposals.map(p => p.id));

    if (allocationsError) {
      console.error('Error checking existing allocations:', allocationsError);
      return;
    }

    // Create a Set of existing proposal IDs for fast lookup
    const existingProposalIds = new Set(existingAllocations?.map(alloc => alloc.proposal_id) || []);
    
    // Find proposals that need allocations
    const proposalsNeedingAllocation = activeProposals.filter(
      proposal => !existingProposalIds.has(proposal.id)
    );

    if (proposalsNeedingAllocation.length === 0) {
      return;
    }

    // Batch create allocations
    const newAllocations = proposalsNeedingAllocation.map(proposal => ({
      user_id: userId,
      proposal_id: proposal.id,
      allocated_at: new Date().toISOString(),
      has_voted: false,
    }));

    const { error: insertError } = await supabaseWithTypes
      .from('vote_allocations')
      .insert(newAllocations);

    if (insertError) {
      console.error('Error creating vote allocations:', insertError);
    }
  } catch (error) {
    console.error('Error in allocateVotesToUser:', error);
  }
}

export async function allocateVotesToAllUsers(proposalId: string): Promise<void> {
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'user');

  if (error) {
    console.error('Error getting users:', error);
    return;
  }

  const allocations = users.map(user => ({
    user_id: user.id,
    proposal_id: proposalId,
    allocated_at: new Date().toISOString(),
    has_voted: false,
  }));

  const { error: insertError } = await supabaseWithTypes
    .from('vote_allocations')
    .insert(allocations);

  if (insertError) {
    console.error('Error allocating votes:', insertError);
  }
}

export async function createVoteAllocation(
  userId: string,
  proposalId: string
): Promise<VoteAllocation | null> {
  const { data, error } = await supabaseWithTypes
    .from('vote_allocations')
    .insert({
      user_id: userId,
      proposal_id: proposalId,
      allocated_at: new Date().toISOString(),
      has_voted: false,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating vote allocation:', error);
    return null;
  }

  return data as unknown as VoteAllocation;
}

export async function getVoteAllocation(
  userId: string,
  proposalId: string
): Promise<VoteAllocation | null> {
  const { data, error } = await supabaseWithTypes
    .from('vote_allocations')
    .select('*')
    .eq('user_id', userId)
    .eq('proposal_id', proposalId)
    .single();

  if (error) {
    return null;
  }

  return data as unknown as VoteAllocation;
}

export async function getUserVoteAllocations(userId: string): Promise<VoteAllocation[]> {
  const { data, error } = await supabaseWithTypes
    .from('vote_allocations')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error getting user vote allocations:', error);
    return [];
  }

  return data as unknown as VoteAllocation[];
}

// Voting
export async function submitVote(
  userId: string,
  proposalId: string,
  voteChoice: string
): Promise<Vote | null> {
  const { data, error } = await supabaseWithTypes
    .from('votes')
    .upsert({
      user_id: userId,
      proposal_id: proposalId,
      vote_choice: voteChoice,
      voted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,proposal_id',
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error submitting vote:', error);
    return null;
  }

  // Update allocation status
  await supabaseWithTypes
    .from('vote_allocations')
    .update({ has_voted: true })
    .eq('user_id', userId)
    .eq('proposal_id', proposalId);

  return data as unknown as Vote;
}

export async function getUserVotes(userId: string): Promise<Vote[]> {
  const { data, error } = await supabaseWithTypes
    .from('votes')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error getting user votes:', error);
    return [];
  }

  return data as unknown as Vote[];
}

export async function getVoteByUserAndProposal(
  userId: string,
  proposalId: string
): Promise<Vote | null> {
  const { data, error } = await supabaseWithTypes
    .from('votes')
    .select('*')
    .eq('user_id', userId)
    .eq('proposal_id', proposalId)
    .single();

  if (error) {
    return null;
  }

  return data as unknown as Vote;
}

export async function getVotesByProposal(proposalId: string): Promise<Vote[]> {
  const { data, error } = await supabaseWithTypes
    .from('votes')
    .select('*')
    .eq('proposal_id', proposalId);

  if (error) {
    console.error('Error getting votes by proposal:', error);
    return [];
  }

  return data as unknown as Vote[];
}

// Results
export async function calculateVoteResults(proposalId: string): Promise<VoteResults | null> {
  const votes = await getVotesByProposal(proposalId);

  if (votes.length === 0) {
    return null;
  }

  const results = votes.reduce((acc, vote) => {
    acc[vote.vote_choice] = (acc[vote.vote_choice] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = votes.length;
  const percentages = Object.entries(results).reduce((acc, [choice, count]) => {
    acc[choice] = parseFloat(((count / total) * 100).toFixed(2));
    return acc;
  }, {} as Record<string, number>);

  return { results, total, percentages };
}

// NFT management
export async function updateProposalNFT(
  proposalId: string,
  nftData: {
    nft_minted: boolean;
    nft_contract_address?: string;
    nft_token_id?: string;
    nft_ipfs_hash?: string;
    nft_transaction_hash?: string;
    screenshot_url?: string;
  }
): Promise<boolean> {
  const { error } = await supabaseWithTypes
    .from('proposals')
    .update(nftData)
    .eq('id', proposalId);

  if (error) {
    console.error('Error updating proposal NFT:', error);
    return false;
  }

  return true;
}
