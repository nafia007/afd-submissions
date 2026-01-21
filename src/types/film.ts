
export interface Film {
  id: string;
  title: string;
  director: string;
  description: string;
  film_url: string;
  video_url?: string;
  price: string;
  budget?: string;
  completion_status: 'pre_production' | 'in_production' | 'post_production' | 'completed' | 'distributed';
  genre?: string;
  production_company?: string;
  release_date?: string;
  duration_minutes?: number;
  language?: string;
  country?: string;
  awards?: any[];
  festival_submissions?: any[];
  rating?: string;
  keywords?: string[];
  poster_url?: string;
  trailer_url?: string;
  screenplay_url?: string;
  press_kit_url?: string;
  cast_crew?: any[];
  created_at: string;
  updated_at: string;
  token_id?: number;
  user_id?: string;
}
