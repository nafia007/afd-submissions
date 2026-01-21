-- Fix admin user profile mapping
-- Update the profile record to match the correct user_id with auth user id
UPDATE profiles 
SET user_id = 'eeb5d81d-293d-4106-857d-22e60dc7d991'
WHERE id = 'eeb5d81d-293d-4106-857d-22e60dc7d991' 
AND role = 'admin';

-- Verify the admin check function works correctly  
-- The get_current_user_role function checks: profiles.id = auth.uid()
-- So we need the profile.id to match the authenticated user's id