import { Film } from "@/types/film";
import StreamingFilmCard from "./StreamingFilmCard";

interface StreamingFilmGridProps {
  films: Film[];
  isLoading: boolean;
  onDelete: (filmId: string) => Promise<void>;
  userProfile: { id: string; role: 'admin' | 'user' } | null;
}

const StreamingFilmGrid = ({ films, isLoading, onDelete, userProfile }: StreamingFilmGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!films || films.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold mb-2">No films available</h3>
        <p className="text-muted-foreground">Check back later for new content.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
      {films.map((film) => (
        <StreamingFilmCard
          key={film.id}
          film={film}
          onDelete={userProfile?.role === 'admin' ? () => onDelete(film.id) : undefined}
        />
      ))}
    </div>
  );
};

export default StreamingFilmGrid;