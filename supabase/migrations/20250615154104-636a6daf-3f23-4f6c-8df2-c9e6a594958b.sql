
-- Create a new table for AFD film submissions with tier, upload type, etc.

CREATE TABLE public.afd_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  director text,
  tier varchar NOT NULL CHECK (tier IN ('script', 'work_in_progress', 'finished_film')),
  file_url text NOT NULL,
  file_type text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security for privacy
ALTER TABLE public.afd_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: users can insert their own
CREATE POLICY "Users can insert their own submissions"
  ON public.afd_submissions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: users can select their own; all users can view finished films and works in progress
CREATE POLICY "Users see their submissions and viewable tiers"
  ON public.afd_submissions
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR tier IN ('work_in_progress', 'finished_film')
  );

-- Policy: users can update their own
CREATE POLICY "Users can update their own submissions"
  ON public.afd_submissions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: users can delete their own
CREATE POLICY "Users can delete their own submissions"
  ON public.afd_submissions
  FOR DELETE
  USING (auth.uid() = user_id);
