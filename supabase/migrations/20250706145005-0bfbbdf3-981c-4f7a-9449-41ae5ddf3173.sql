-- Fix infinite recursion in profiles table policies
-- Drop all existing policies first
DROP POLICY IF EXISTS "Admin users can view all profile data" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow admins to view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create clean, non-recursive policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile  
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles (using the function to avoid recursion)
CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT USING (get_current_user_role() = 'admin');

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
FOR UPDATE USING (get_current_user_role() = 'admin');