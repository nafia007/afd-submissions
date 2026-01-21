-- Add admin policies for filmmaker_profiles table to allow showcase management

-- Allow admins to update any filmmaker profile for showcase management
CREATE POLICY "Admins can update any filmmaker profile" 
ON public.filmmaker_profiles 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

-- Allow admins to view all filmmaker profiles (they already can via existing policies, but let's be explicit)
CREATE POLICY "Admins can view all filmmaker profiles" 
ON public.filmmaker_profiles 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);