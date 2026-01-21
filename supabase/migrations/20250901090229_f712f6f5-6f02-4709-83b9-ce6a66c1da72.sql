-- Enable RLS on tables that need it
ALTER TABLE public.filmmaker_showcase ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showcae ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for filmmaker_showcase
CREATE POLICY "Anyone can view filmmaker showcase" 
ON public.filmmaker_showcase 
FOR SELECT 
USING (true);

-- Create basic RLS policies for showcae table (though it seems unused)
CREATE POLICY "Users can view showcae" 
ON public.showcae 
FOR SELECT 
USING (true);