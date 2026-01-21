-- Enhance posts table for advanced community features
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS post_type TEXT NOT NULL DEFAULT 'general';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS funding_amount TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS job_location TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS job_salary TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS external_url TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS showcase_submission_id UUID REFERENCES afd_submissions(id);

-- Create post types enum
DO $$ BEGIN
  CREATE TYPE post_type AS ENUM ('general', 'news', 'funding', 'jobs', 'showcase');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Update post_type column to use enum
ALTER TABLE public.posts ALTER COLUMN post_type TYPE post_type USING post_type::post_type;

-- Create post reactions table
CREATE TABLE IF NOT EXISTS public.post_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction_type TEXT NOT NULL DEFAULT 'like',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id, reaction_type)
);

-- Enable RLS on post_reactions
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

-- Create policies for post_reactions
CREATE POLICY "Users can create reactions" ON public.post_reactions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" ON public.post_reactions
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view reactions" ON public.post_reactions
FOR SELECT USING (true);

-- Create post comments table
CREATE TABLE IF NOT EXISTS public.post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on post_comments
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for post_comments
CREATE POLICY "Users can create comments" ON public.post_comments
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.post_comments
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.post_comments
FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view comments" ON public.post_comments
FOR SELECT USING (true);

-- Create function to update comment counts
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for comment counts
DROP TRIGGER IF EXISTS trigger_update_comments_count ON post_comments;
CREATE TRIGGER trigger_update_comments_count
  AFTER INSERT OR DELETE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- Create function to update like counts
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for like counts
DROP TRIGGER IF EXISTS trigger_update_likes_count ON post_reactions;
CREATE TRIGGER trigger_update_likes_count
  AFTER INSERT OR DELETE ON post_reactions
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- Create updated_at trigger for comments
CREATE TRIGGER update_post_comments_updated_at
  BEFORE UPDATE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();