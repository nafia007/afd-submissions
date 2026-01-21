
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FilmReview {
  id: string;
  film_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  helpful_count: number;
}

export function useFilmReviews(filmId: string) {
  return useQuery({
    queryKey: ['filmReviews', filmId],
    queryFn: async (): Promise<FilmReview[]> => {
      const { data, error } = await supabase
        .from('film_reviews')
        .select('*')
        .eq('film_id', filmId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
}

export function useFilmAverageRating(filmId: string) {
  return useQuery({
    queryKey: ['filmAverageRating', filmId],
    queryFn: async (): Promise<number> => {
      const { data, error } = await supabase
        .rpc('get_film_average_rating', { film_id: filmId });

      if (error) throw error;
      return data || 0;
    }
  });
}
