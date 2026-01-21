-- Fix the security definer view by making it a regular view and ensuring proper RLS policies
DROP VIEW IF EXISTS public.filmmaker_showcase;

-- Create the view without SECURITY DEFINER
CREATE VIEW public.filmmaker_showcase AS
SELECT 
  fp.id,
  fp.bio,
  fp.portfolio_url,
  fp.website_url,
  fp.skills,
  fp.profile_image_url,
  fp.created_at,
  fp.updated_at,
  fpe.name,
  fpe.role,
  fpe.experience
FROM public.filmmaker_profiles fp
LEFT JOIN public.filmmaker_profiles_extended fpe ON fp.id = fpe.id
WHERE fp.show_in_showcase = true;