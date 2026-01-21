-- Create storage bucket for AFD submissions
INSERT INTO storage.buckets (id, name, public)
VALUES ('afd-uploads', 'afd-uploads', false);

-- Create storage policies for AFD uploads
CREATE POLICY "Users can upload their own AFD files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'afd-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own AFD files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'afd-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all AFD files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'afd-uploads' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);