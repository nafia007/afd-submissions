-- Add missing fields for filmmakers to films table
ALTER TABLE public.films 
ADD COLUMN IF NOT EXISTS genre varchar(100),
ADD COLUMN IF NOT EXISTS budget varchar(50),
ADD COLUMN IF NOT EXISTS completion_status varchar(50) DEFAULT 'pre_production',
ADD COLUMN IF NOT EXISTS cast_crew jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS production_company varchar(255),
ADD COLUMN IF NOT EXISTS release_date date,
ADD COLUMN IF NOT EXISTS duration_minutes integer,
ADD COLUMN IF NOT EXISTS language varchar(50) DEFAULT 'English',
ADD COLUMN IF NOT EXISTS country varchar(100),
ADD COLUMN IF NOT EXISTS awards jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS festival_submissions jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS rating varchar(10),
ADD COLUMN IF NOT EXISTS keywords text[],
ADD COLUMN IF NOT EXISTS poster_url text,
ADD COLUMN IF NOT EXISTS trailer_url text,
ADD COLUMN IF NOT EXISTS screenplay_url text,
ADD COLUMN IF NOT EXISTS press_kit_url text;

-- Update existing films with default values for new fields
UPDATE public.films 
SET 
    genre = 'Drama' WHERE genre IS NULL,
    completion_status = 'completed' WHERE completion_status IS NULL,
    language = 'English' WHERE language IS NULL,
    country = 'USA' WHERE country IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_films_genre ON public.films(genre);
CREATE INDEX IF NOT EXISTS idx_films_completion_status ON public.films(completion_status);
CREATE INDEX IF NOT EXISTS idx_films_release_date ON public.films(release_date);

-- Add film investment tracking table
CREATE TABLE IF NOT EXISTS film_investments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    film_id uuid NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    investor_id uuid NOT NULL,
    amount_invested numeric NOT NULL,
    tokens_received numeric NOT NULL,
    investment_date timestamp with time zone DEFAULT now(),
    transaction_hash text,
    status varchar(20) DEFAULT 'pending'
);

-- Enable RLS on film_investments
ALTER TABLE film_investments ENABLE ROW LEVEL SECURITY;

-- RLS policies for film_investments
CREATE POLICY "Users can view their own investments" ON film_investments
    FOR SELECT USING (investor_id = auth.uid());

CREATE POLICY "Users can create their own investments" ON film_investments
    FOR INSERT WITH CHECK (investor_id = auth.uid());

-- Add film revenue tracking
CREATE TABLE IF NOT EXISTS film_revenues (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    film_id uuid NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    period_start date NOT NULL,
    period_end date NOT NULL,
    total_revenue numeric NOT NULL DEFAULT 0,
    distribution_revenue numeric DEFAULT 0,
    streaming_revenue numeric DEFAULT 0,
    merchandise_revenue numeric DEFAULT 0,
    licensing_revenue numeric DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on film_revenues
ALTER TABLE film_revenues ENABLE ROW LEVEL SECURITY;

-- RLS policies for film_revenues
CREATE POLICY "Film owners can manage revenue" ON film_revenues
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM films 
            WHERE films.id = film_revenues.film_id 
            AND films.user_id = auth.uid()
        )
    );

CREATE POLICY "Investors can view revenue" ON film_revenues
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM film_investments 
            WHERE film_investments.film_id = film_revenues.film_id 
            AND film_investments.investor_id = auth.uid()
        )
    );