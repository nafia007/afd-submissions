-- Proposals table
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  voting_options JSONB DEFAULT '["For", "Against", "Abstain"]',
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active, closed, archived
  created_by UUID REFERENCES profiles(id),
  quorum_required INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  closed_at TIMESTAMP,
  nft_minted BOOLEAN DEFAULT false,
  nft_contract_address VARCHAR(42),
  nft_token_id VARCHAR(78),
  nft_ipfs_hash VARCHAR(100),
  nft_transaction_hash VARCHAR(66),
  screenshot_url TEXT
);

-- Votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  proposal_id UUID REFERENCES proposals(id) NOT NULL,
  vote_choice VARCHAR(50) NOT NULL,
  voted_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, proposal_id)
);

-- Vote allocations table
CREATE TABLE vote_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  proposal_id UUID REFERENCES proposals(id) NOT NULL,
  allocated_at TIMESTAMP DEFAULT NOW(),
  has_voted BOOLEAN DEFAULT false,
  UNIQUE(user_id, proposal_id)
);

-- Indexes for performance
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_votes_user ON votes(user_id);
CREATE INDEX idx_votes_proposal ON votes(proposal_id);
CREATE INDEX idx_allocations_user ON vote_allocations(user_id);
