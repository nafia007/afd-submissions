-- Create brand_ads table for sidebar advertisements
CREATE TABLE IF NOT EXISTS public.brand_ads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.brand_ads ENABLE ROW LEVEL SECURITY;

-- Create policies for brand_ads
CREATE POLICY "Anyone can view active brand ads" 
ON public.brand_ads 
FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can manage brand ads" 
ON public.brand_ads 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'::user_role
));

-- Create trigger for updated_at
CREATE TRIGGER update_brand_ads_updated_at
BEFORE UPDATE ON public.brand_ads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();