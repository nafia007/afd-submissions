
-- Update the RLS policy to allow admins to view all AFD submissions
DROP POLICY IF EXISTS "Users see their submissions and viewable tiers" ON public.afd_submissions;

CREATE POLICY "Users see their submissions, viewable tiers, and admins see all" 
ON public.afd_submissions 
FOR SELECT 
USING (
  -- Users can see their own submissions
  (auth.uid() = user_id) 
  OR 
  -- Users can see viewable tiers (work_in_progress and finished_film)
  ((tier)::text = ANY ((ARRAY['work_in_progress'::character varying, 'finished_film'::character varying])::text[])) 
  OR 
  -- Admins can see all submissions
  (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::public.user_role
  ))
);
