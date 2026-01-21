import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FilmIPToken {
  id: string;
  film_id: string;
  total_supply: number;
  available_tokens: number;
  token_price: number;
  token_symbol: string;
  contract_address: string | null;
  revenue_share_percentage: number;
  created_at: string;
  updated_at: string;
}

export function useFilmIPToken(filmId: string | undefined) {
  return useQuery({
    queryKey: ['filmIPToken', filmId],
    queryFn: async (): Promise<FilmIPToken | null> => {
      if (!filmId) return null;

      const { data, error } = await supabase
        .from('film_ip_tokens')
        .select('*')
        .eq('film_id', filmId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching film IP token:", error);
        throw error;
      }
      
      return data as FilmIPToken | null;
    },
    enabled: !!filmId
  });
}

export function useAllIPTokens() {
  return useQuery({
    queryKey: ['allIPTokens'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('film_ip_tokens')
        .select(`
          *,
          films (*)
        `)
        .gt('available_tokens', 0)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });
}

export function usePurchaseIPTokens() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      filmId, 
      tokenAmount 
    }: { 
      filmId: string; 
      tokenAmount: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Get current IP token data
      const { data: ipToken, error: fetchError } = await supabase
        .from('film_ip_tokens')
        .select('*')
        .eq('film_id', filmId)
        .single();

      if (fetchError) throw fetchError;
      if (ipToken.available_tokens < tokenAmount) {
        throw new Error("Not enough tokens available");
      }

      const totalAmount = ipToken.token_price * tokenAmount;

      // Record transaction
      const { data: transaction, error: txError } = await supabase
        .from('ip_token_transactions')
        .insert({
          to_user_id: user.id,
          film_id: filmId,
          token_amount: tokenAmount,
          price_per_token: ipToken.token_price,
          total_amount: totalAmount,
          transaction_type: 'buy',
          transaction_hash: `hash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })
        .select()
        .single();

      if (txError) throw txError;

      // Update available tokens
      const { error: updateError } = await supabase
        .from('film_ip_tokens')
        .update({ 
          available_tokens: ipToken.available_tokens - tokenAmount 
        })
        .eq('id', ipToken.id);

      if (updateError) throw updateError;

      // Check if user already has tokens for this film
      const { data: existingHolder } = await supabase
        .from('token_holders')
        .select('*')
        .eq('user_id', user.id)
        .eq('asset_id', filmId)
        .maybeSingle();

      if (existingHolder) {
        // Update existing holding
        const { error: holderUpdateError } = await supabase
          .from('token_holders')
          .update({
            token_amount: Number(existingHolder.token_amount) + tokenAmount
          })
          .eq('id', existingHolder.id);

        if (holderUpdateError) throw holderUpdateError;
      } else {
        // Create new token holder entry
        const { error: holderError } = await supabase
          .from('token_holders')
          .insert({
            user_id: user.id,
            asset_id: filmId,
            token_amount: tokenAmount,
            purchase_price: ipToken.token_price
          });

        if (holderError) throw holderError;
      }

      return transaction;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['filmIPToken', variables.filmId] });
      queryClient.invalidateQueries({ queryKey: ['allIPTokens'] });
      queryClient.invalidateQueries({ queryKey: ['userIPPortfolio'] });
      toast.success("IP tokens purchased successfully!");
    },
    onError: (error) => {
      toast.error("Purchase failed", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    }
  });
}

export function useUserIPPortfolio() {
  return useQuery({
    queryKey: ['userIPPortfolio'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('token_holders')
        .select(`
          *,
          films:asset_id (*)
        `)
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });

      if (error) throw error;
      return data;
    }
  });
}
