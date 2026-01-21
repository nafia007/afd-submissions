
import { Film } from "@/types/film";
import FilmCard from "@/components/FilmCard";

interface FilmGridProps {
  films: Film[];
  isLoading: boolean;
  onDelete: (filmId: string) => Promise<void>;
  userProfile: { id: string; role: 'admin' | 'user' } | null;
}

const FilmGrid = ({ films, isLoading, onDelete, userProfile }: FilmGridProps) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading films...</div>;
  }

  if (!films || films.length === 0) {
    return <div className="text-center py-8">No films available at the moment.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {films.map((film) => (
        <FilmCard
          key={film.id}
          id={film.id}
          title={film.title}
          description={film.description || ""}
          price={film.price}
          director={film.director}
          videoUrl={film.video_url}
          onDelete={userProfile?.role === 'admin' ? () => onDelete(film.id) : undefined}
        />
      ))}
    </div>
  );
};

export default FilmGrid;
