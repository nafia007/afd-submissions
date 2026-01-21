-- Fix security issues by enabling RLS on the showcae table only
ALTER TABLE public.showcae ENABLE ROW LEVEL SECURITY;

-- Add basic policy for showcae table (appears to be empty/unused)
CREATE POLICY "Allow public read access to showcae" ON public.showcae
FOR SELECT USING (true);