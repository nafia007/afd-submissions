-- Film purchases table for tracking rentals and purchases
CREATE TABLE public.film_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('rent', 'buy')),
  price_paid NUMERIC NOT NULL,
  purchase_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  access_expiry TIMESTAMPTZ,
  transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User watch history table
CREATE TABLE public.user_watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
  watch_progress NUMERIC NOT NULL DEFAULT 0,
  last_watched TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, film_id)
);

-- Film IP tokens table for tokenization
CREATE TABLE public.film_ip_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE UNIQUE,
  total_supply BIGINT NOT NULL,
  available_tokens BIGINT NOT NULL,
  token_price NUMERIC NOT NULL,
  token_symbol TEXT NOT NULL,
  contract_address TEXT,
  revenue_share_percentage NUMERIC NOT NULL DEFAULT 70,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- IP token transactions table
CREATE TABLE public.ip_token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  to_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  film_id UUID NOT NULL REFERENCES public.films(id) ON DELETE CASCADE,
  token_amount NUMERIC NOT NULL,
  price_per_token NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('buy', 'sell', 'transfer')),
  transaction_hash TEXT,
  transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.film_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.film_ip_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ip_token_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for film_purchases
CREATE POLICY "Users can view their own purchases"
  ON public.film_purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchases"
  ON public.film_purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_watch_history
CREATE POLICY "Users can view their own watch history"
  ON public.user_watch_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own watch history"
  ON public.user_watch_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watch history"
  ON public.user_watch_history FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for film_ip_tokens
CREATE POLICY "Anyone can view film IP tokens"
  ON public.film_ip_tokens FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage film IP tokens"
  ON public.film_ip_tokens FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ));

-- RLS Policies for ip_token_transactions
CREATE POLICY "Users can view their own IP transactions"
  ON public.ip_token_transactions FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create IP token purchases"
  ON public.ip_token_transactions FOR INSERT
  WITH CHECK (auth.uid() = to_user_id);

-- Create indexes for performance
CREATE INDEX idx_film_purchases_user_id ON public.film_purchases(user_id);
CREATE INDEX idx_film_purchases_film_id ON public.film_purchases(film_id);
CREATE INDEX idx_watch_history_user_id ON public.user_watch_history(user_id);
CREATE INDEX idx_watch_history_film_id ON public.user_watch_history(film_id);
CREATE INDEX idx_ip_tokens_film_id ON public.film_ip_tokens(film_id);
CREATE INDEX idx_ip_transactions_user_id ON public.ip_token_transactions(to_user_id);

-- Create trigger for updating film_ip_tokens updated_at
CREATE TRIGGER update_film_ip_tokens_updated_at
  BEFORE UPDATE ON public.film_ip_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();