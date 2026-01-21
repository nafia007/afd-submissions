-- Add approval status and review fields to afd_submissions
ALTER TABLE public.afd_submissions 
ADD COLUMN approval_status TEXT DEFAULT 'pending' NOT NULL CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN admin_notes TEXT;