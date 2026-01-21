-- Fix security issue: Remove public visibility of certain tier submissions
-- Only allow users to see their own submissions and admins to see all

DROP POLICY IF EXISTS "Users see their submissions, viewable tiers, and admins see all" ON public.afd_submissions;

CREATE POLICY "Users see own submissions, admins see all" 
ON public.afd_submissions 
FOR SELECT 
USING (
  -- Users can see only their own submissions
  (auth.uid() = user_id) 
  OR 
  -- Admins can see all submissions
  (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::public.user_role
  ))
);