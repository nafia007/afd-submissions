-- Create storage bucket for post attachments
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-attachments',
  'post-attachments',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
);

-- Create RLS policies for post attachments bucket
CREATE POLICY "Anyone can view post attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-attachments');

CREATE POLICY "Authenticated users can upload post attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'post-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own post attachments"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'post-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own post attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'post-attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add attachments array field to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Add comment to describe the attachments structure
COMMENT ON COLUMN posts.attachments IS 'Array of attachment objects with structure: [{"url": "storage_url", "name": "filename", "type": "image|file", "mime_type": "mime/type"}]';