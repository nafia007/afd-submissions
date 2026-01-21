-- Create dedicated brand-ads storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-ads', 'brand-ads', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for brand ads management
-- Allow admins to upload brand ad images
CREATE POLICY "Admins can upload brand ad images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'brand-ads' 
  AND EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

-- Allow admins to update brand ad images
CREATE POLICY "Admins can update brand ad images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'brand-ads' 
  AND EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

-- Allow admins to delete brand ad images
CREATE POLICY "Admins can delete brand ad images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'brand-ads' 
  AND EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::user_role
  )
);

-- Allow public to view brand ad images (since bucket is public)
CREATE POLICY "Public can view brand ad images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'brand-ads');