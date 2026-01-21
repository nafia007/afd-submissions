
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Film } from "@/types/film";

export function useFilmDetails(filmId: string | undefined) {
  return useQuery({
    queryKey: ['filmDetails', filmId],
    queryFn: async (): Promise<Film | null> => {
      if (!filmId) return null;
      
      const { data, error } = await supabase
        .from('films')
        .select('*')
        .eq('id', filmId)
        .single();

      if (error) {
        console.error("Error fetching film details:", error);
        throw error;
      }
      
      return {
        ...data,
        completion_status: 'completed' as const
      } as Film;
    },
    enabled: !!filmId
  });
}
