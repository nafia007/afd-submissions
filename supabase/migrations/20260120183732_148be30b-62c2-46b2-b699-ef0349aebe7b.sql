-- Create enum for team types
CREATE TYPE public.team_type AS ENUM ('creator_circle', 'tech_builders', 'bridge_builders', 'stewards');

-- Create enum for team member roles
CREATE TYPE public.team_role AS ENUM ('lead', 'core_member', 'contributor', 'observer');

-- Create teams table
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_type team_type NOT NULL UNIQUE,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    responsibilities TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team memberships table
CREATE TABLE public.team_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role team_role NOT NULL DEFAULT 'observer',
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (team_id, user_id)
);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_memberships ENABLE ROW LEVEL SECURITY;

-- Security definer function to check team membership
CREATE OR REPLACE FUNCTION public.is_team_member(_user_id UUID, _team_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.team_memberships
    WHERE user_id = _user_id
      AND team_id = _team_id
  )
$$;

-- Security definer function to check if user is team lead
CREATE OR REPLACE FUNCTION public.is_team_lead(_user_id UUID, _team_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.team_memberships
    WHERE user_id = _user_id
      AND team_id = _team_id
      AND role = 'lead'
  )
$$;

-- RLS Policies for teams table
CREATE POLICY "Anyone can view teams"
ON public.teams
FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage teams"
ON public.teams
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- RLS Policies for team_memberships table
CREATE POLICY "Anyone can view team memberships"
ON public.team_memberships
FOR SELECT
USING (true);

CREATE POLICY "Users can join teams as observer"
ON public.team_memberships
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND role = 'observer'
);

CREATE POLICY "Users can leave teams"
ON public.team_memberships
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Team leads can update member roles"
ON public.team_memberships
FOR UPDATE
TO authenticated
USING (
  public.is_team_lead(auth.uid(), team_id) OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Triggers for updated_at
CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_memberships_updated_at
BEFORE UPDATE ON public.team_memberships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the 4 core teams
INSERT INTO public.teams (team_type, name, tagline, description, icon, responsibilities) VALUES
('creator_circle', 'Creator Circle', 'Champions of the Storytellers', 'Empower filmmakers from pitch to premiere.', 'film', ARRAY['Review and select film projects for funding', 'Connect creators with resources, mentors, and crew', 'Ensure all processes respect creative vision and ownership', 'Be the loudest voice for filmmakers in DAO decisions']),
('tech_builders', 'Tech & Platform Builders', 'Architects of the Sovereign System', 'Build and maintain the simple, powerful tools that make ownership possible.', 'code', ARRAY['Develop the secure platform for project submission and NFT minting', 'Ensure smart contracts automatically and fairly handle funding and royalties', 'Make the technology easy for anyone to use, regardless of tech skill', 'Protect the security and transparency of the entire ecosystem']),
('bridge_builders', 'Bridge Builders', 'Connectors to the World', 'Forge the alliances that amplify our stories and grow our ecosystem.', 'handshake', ARRAY['Secure distribution deals with festivals and streaming services', 'Partner with investors, institutions, and global media', 'Engage communities across Africa and the diaspora', 'Spread awareness and attract new creators and supporters']),
('stewards', 'Stewards', 'Guardians of the Vision', 'Ensure the DAO runs smoothly, transparently, and stays true to its values.', 'shield', ARRAY['Facilitate fair community voting on all major decisions', 'Manage the shared treasury with full transparency', 'Oversee the day-to-day health and coordination of the DAO', 'Uphold the principles of the manifesto in every action']);