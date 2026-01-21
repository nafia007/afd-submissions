-- Drop overly permissive SELECT policies on filmmaker_profiles
DROP POLICY IF EXISTS "Anyone can view filmmaker profiles" ON public.filmmaker_profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.filmmaker_profiles;
DROP POLICY IF EXISTS "Users can view all filmmaker_profiles" ON public.filmmaker_profiles;

-- Create new policy: Public can only view profiles that are in showcase
CREATE POLICY "Public can view showcase profiles only" 
ON public.filmmaker_profiles 
FOR SELECT 
USING (show_in_showcase = true);

-- Keep existing policies for users viewing their own profile and admins viewing all
-- These are already in place:
-- "Users can view own filmmaker profile" - (auth.uid() = id)
-- "Admins can view all filmmaker profiles" - admin role check