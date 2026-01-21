-- Drop the public showcase policy
DROP POLICY IF EXISTS "Public can view showcase profiles only" ON public.filmmaker_profiles;

-- Create new policy: Only authenticated users can view showcase profiles
CREATE POLICY "Authenticated users can view showcase profiles" 
ON public.filmmaker_profiles 
FOR SELECT 
TO authenticated
USING (show_in_showcase = true OR auth.uid() = id);