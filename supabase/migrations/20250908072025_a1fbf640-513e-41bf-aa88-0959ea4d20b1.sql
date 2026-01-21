-- Fix security vulnerability: Enable RLS on user_profiles table and restrict access
-- The user_profiles table currently has no RLS policies, making email addresses publicly accessible

-- Enable Row Level Security on user_profiles table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Only admins should be able to view user profiles (contains sensitive email data)
CREATE POLICY "Admins can view user profiles" 
ON public.user_profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

-- Only admins should be able to manage user profiles  
CREATE POLICY "Admins can manage user profiles" 
ON public.user_profiles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

-- Add comment for clarity
COMMENT ON TABLE public.user_profiles IS 'Admin-only table for managing user profile data. Contains sensitive information like email addresses.';