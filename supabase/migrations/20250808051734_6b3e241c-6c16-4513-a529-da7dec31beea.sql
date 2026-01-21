-- Add image upload and showcase preferences to filmmaker profiles
ALTER TABLE public.filmmaker_profiles 
ADD COLUMN profile_image_url TEXT,
ADD COLUMN show_in_showcase BOOLEAN DEFAULT false;

-- Create a storage bucket for profile images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for profile images
CREATE POLICY "Users can upload their own profile images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Profile images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-images');

-- Create a view for public filmmaker showcase
CREATE OR REPLACE VIEW public.filmmaker_showcase AS
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
FROM public.filmmaker_profiles fp
LEFT JOIN public.filmmaker_profiles_extended fpe ON fp.id = fpe.id
WHERE fp.show_in_showcase = true;