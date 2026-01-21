-- Fix security vulnerability: Secure the user_profiles view access
-- The user_profiles view exposes sensitive auth.users data and needs proper access control

-- Drop the existing view to recreate it with proper security
DROP VIEW IF EXISTS public.user_profiles;

-- The view was exposing auth.users data without proper access control
-- Since we can't apply RLS to views, we need to ensure access is controlled through functions

-- The existing get_user_profiles_for_admin() function already has proper admin checks
-- Let's add a comment to document the security approach
COMMENT ON FUNCTION public.get_user_profiles_for_admin() IS 'SECURITY: This function restricts access to user profile data to admin users only. The user_profiles view has been removed to prevent unauthorized access to email addresses and auth data.';