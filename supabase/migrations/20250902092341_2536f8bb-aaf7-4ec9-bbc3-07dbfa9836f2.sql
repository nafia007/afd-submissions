-- Fix the migration that failed (user_profiles is a view)
-- Just enable RLS on showcae table and add basic policies

-- Drop the failed policies for user_profiles (since it's a view)
-- user_profiles is a view so we can't enable RLS on it

-- Let's check the current user's admin status and make sure we can test the showcase functionality
-- by temporarily updating the showcase status of a profile
SELECT 
  p.id,
  p.role,
  'Current user role: ' || COALESCE(p.role::text, 'NULL') as debug_info
FROM profiles p 
WHERE p.id = auth.uid();