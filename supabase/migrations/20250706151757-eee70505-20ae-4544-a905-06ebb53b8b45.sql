-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Users can upload their own AFD files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own AFD files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all AFD files" ON storage.objects;

-- Create new policies with correct folder structure
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

-- Also create a policy for users to update their own files
CREATE POLICY "Users can update their own AFD files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'afd-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- And delete policy
CREATE POLICY "Users can delete their own AFD files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'afd-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);