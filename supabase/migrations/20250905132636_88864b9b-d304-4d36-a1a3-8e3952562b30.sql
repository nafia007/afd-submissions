-- Add missing columns to films table for better streaming experience
ALTER TABLE public.films 
ADD COLUMN IF NOT EXISTS genre text,
ADD COLUMN IF NOT EXISTS year text;