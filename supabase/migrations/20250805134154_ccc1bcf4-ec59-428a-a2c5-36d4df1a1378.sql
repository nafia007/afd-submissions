-- Fix database function security issues by setting proper search paths

-- Update get_user_profiles_for_admin function
CREATE OR REPLACE FUNCTION public.get_user_profiles_for_admin()
 RETURNS TABLE(id uuid, email text, role text, created_at timestamp with time zone, last_sign_in_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if the current user is admin using profiles table role
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
$function$;

-- Update other security definer functions to have proper search paths
CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN (
    SELECT role::text 
    FROM public.profiles 
    WHERE id = auth.uid()
  );
EXCEPTION
  WHEN others THEN
    RETURN NULL;
END;
$function$;

-- Update handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update create_user function
CREATE OR REPLACE FUNCTION public.create_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$function$;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert into profiles table with proper values
  INSERT INTO public.profiles (id, user_id, created_at, role)
  VALUES (NEW.id, NEW.id, NOW(), 'user');
  
  -- Insert a basic filmmaker profile
  INSERT INTO public.filmmaker_profiles (id, bio, skills, created_at, updated_at)
  VALUES (NEW.id, '', ARRAY[]::public.filmmaker_skill[], NOW(), NOW());
  
  -- Insert extended filmmaker profile with name from metadata
  INSERT INTO public.filmmaker_profiles_extended (id, name, role, experience, skills, image, created_at, updated_at)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'Film Enthusiast'), 
    'Film Enthusiast',
    'New to the platform', 
    ARRAY['watching', 'discussing']::text[], 
    'photo-1485846234645-a62644f84728', 
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$function$;