-- Fix critical security issues by enabling RLS on tables that need it

-- Enable RLS on showcae table (seems to be a typo but it exists)
ALTER TABLE public.showcae ENABLE ROW LEVEL SECURITY;

-- Add basic policy for showcae table
CREATE POLICY "Anyone can view showcae" 
ON public.showcae 
FOR SELECT 
TO authenticated
USING (true);

-- Enable RLS on user_profiles table 
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Add basic policies for user_profiles
CREATE POLICY "Users can view their own user profile" 
ON public.user_profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all user profiles" 
ON public.user_profiles 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);