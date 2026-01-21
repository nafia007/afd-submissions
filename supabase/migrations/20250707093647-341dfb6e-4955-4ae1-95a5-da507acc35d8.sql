-- Add new fields to afd_submissions table for pitch deck information
ALTER TABLE public.afd_submissions 
ADD COLUMN format TEXT,
ADD COLUMN genre TEXT,
ADD COLUMN country_of_origin TEXT,
ADD COLUMN country_of_production TEXT,
ADD COLUMN budget TEXT,
ADD COLUMN partners TEXT;