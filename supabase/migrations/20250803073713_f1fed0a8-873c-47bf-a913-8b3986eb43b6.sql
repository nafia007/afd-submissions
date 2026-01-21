-- Fix the function to set proper search path
CREATE OR REPLACE FUNCTION public.get_user_profiles_for_admin()
RETURNS TABLE (
  id uuid,
  email text,
  role text,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Check if the current user is admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::public.user_role
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin only.';
  END IF;

  -- Return user profiles data
  RETURN QUERY
  SELECT 
    p.id,
    au.email::text,
    p.role::text,
    p.created_at,
    au.last_sign_in_at
  FROM public.profiles p
  JOIN auth.users au ON p.user_id = au.id
  ORDER BY p.created_at DESC;
END;
$$;