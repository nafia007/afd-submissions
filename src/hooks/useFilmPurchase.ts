import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FilmPurchase {
  id: string;
  user_id: string;
  film_id: string;
  purchase_type: 'rent' | 'buy';
  price_paid: number;
  purchase_date: string;
  access_expiry: string | null;
  transaction_id: string | null;
}

export function useFilmPurchase(filmId: string | undefined) {
  return useQuery({
    queryKey: ['filmPurchase', filmId],
    queryFn: async (): Promise<FilmPurchase | null> => {
      if (!filmId) return null;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('film_purchases')
        .select('*')
        .eq('film_id', filmId)
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching film purchase:", error);
        throw error;
      }

      // Check if rental has expired
      if (data?.purchase_type === 'rent' && data.access_expiry) {
        const expiryDate = new Date(data.access_expiry);
        if (expiryDate < new Date()) {
          return null; // Rental expired
        }
      }
      
      return data as FilmPurchase | null;
    },
    enabled: !!filmId
  });
}

export function usePurchaseFilm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      filmId, 
      purchaseType, 
      price 
    }: { 
      filmId: string; 
      purchaseType: 'rent' | 'buy'; 
      price: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const accessExpiry = purchaseType === 'rent' 
        ? new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() // 48 hours
        : null;

      const { data, error } = await supabase
        .from('film_purchases')
        .insert({
          user_id: user.id,
          film_id: filmId,
          purchase_type: purchaseType,
          price_paid: price,
          access_expiry: accessExpiry,
          transaction_id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['filmPurchase', variables.filmId] });
      const action = variables.purchaseType === 'rent' ? 'rented' : 'purchased';
      toast.success(`Film ${action} successfully!`);
    },
    onError: (error) => {
      toast.error("Purchase failed", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    }
  });
}

export function useUserPurchases() {
  return useQuery({
    queryKey: ['userPurchases'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('film_purchases')
        .select(`
          *,
          films (*)
        `)
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });

      if (error) throw error;
      return data;
    }
  });
}
