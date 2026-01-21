-- Add poster_url column to films table
ALTER TABLE films ADD COLUMN IF NOT EXISTS poster_url TEXT;

-- Update existing films with poster URLs
UPDATE films 
SET poster_url = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800'
WHERE poster_url IS NULL;