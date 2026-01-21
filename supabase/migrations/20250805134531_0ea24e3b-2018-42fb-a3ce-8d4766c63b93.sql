-- Fix remaining functions with search path issues

-- Update get_film_average_rating function
CREATE OR REPLACE FUNCTION public.get_film_average_rating(film_id uuid)
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  avg_rating NUMERIC;
BEGIN
  SELECT COALESCE(AVG(rating)::NUMERIC(10,1), 0) INTO avg_rating
  FROM public.film_reviews
  WHERE film_reviews.film_id = $1;
  
  RETURN avg_rating;
END;
$function$;

-- Update log_user_creation function
CREATE OR REPLACE FUNCTION public.log_user_creation(email text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    RAISE NOTICE 'Attempting to create user with email: %', email;
END;
$function$;

-- Update set_updated_at function
CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;