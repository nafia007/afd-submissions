-- Update the tier check constraint to match the form values
ALTER TABLE public.afd_submissions 
DROP CONSTRAINT IF EXISTS afd_submissions_tier_check;

ALTER TABLE public.afd_submissions 
ADD CONSTRAINT afd_submissions_tier_check 
CHECK (tier IN ('development', 'finished_script', 'post_production', 'complete_seeking_distribution'));