export interface Proposal {
  id: string;
  title: string;
  description: string;
  voting_options: string[];
  start_date: string;
  end_date: string;
  status?: 'active' | 'closed' | 'archived';
  created_by?: string;
  quorum_required: number | null;
  created_at?: string;
  closed_at?: string | null;
  nft_minted?: boolean;
  nft_contract_address?: string | null;
  nft_token_id?: string | null;
  nft_ipfs_hash?: string | null;
  nft_transaction_hash?: string | null;
  screenshot_url?: string | null;
}

export interface Vote {
  id: string;
  user_id: string;
  proposal_id: string;
  vote_choice: string;
  voted_at: string;
  updated_at: string;
}

export interface VoteAllocation {
  id: string;
  user_id: string;
  proposal_id: string;
  allocated_at: string;
  has_voted: boolean;
}

export interface VoteResults {
  results: Record<string, number>;
  total: number;
  percentages: Record<string, number>;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface NFTMintResult {
  tokenId: string;
  transactionHash: string;
  ipfsHash: string;
  metadataHash: string;
}
