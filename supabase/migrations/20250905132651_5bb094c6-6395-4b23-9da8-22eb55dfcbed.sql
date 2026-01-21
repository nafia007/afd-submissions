-- Fix security issues by enabling RLS on tables that need it
ALTER TABLE public.showcae ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Add basic policies for user_profiles (read-only view)
CREATE POLICY "Allow public read access to user profiles" ON public.user_profiles
FOR SELECT USING (true);

-- Add basic policy for showcae table (appears to be empty/unused)
CREATE POLICY "Allow public read access to showcae" ON public.showcae
FOR SELECT USING (true);