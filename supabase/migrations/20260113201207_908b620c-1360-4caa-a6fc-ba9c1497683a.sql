-- Drop the existing view
DROP VIEW IF EXISTS public.filmmaker_showcase;

-- Recreate the view with security_invoker = true
-- This ensures RLS policies are enforced based on the querying user, not the view creator
CREATE OR REPLACE VIEW public.filmmaker_showcase
WITH (security_invoker = true)
AS
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
FROM filmmaker_profiles fp
LEFT JOIN filmmaker_profiles_extended fpe ON fp.id = fpe.id
WHERE fp.show_in_showcase = true;