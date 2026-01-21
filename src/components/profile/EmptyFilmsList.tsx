
import { Button } from "@/components/ui/button";
import { Film as FilmIcon } from "lucide-react";

interface EmptyFilmsListProps {
  onSubmitClick: () => void;
}

const EmptyFilmsList = ({ onSubmitClick }: EmptyFilmsListProps) => {
  return (
    <div className="text-center py-12 border border-dashed rounded-lg">
      <FilmIcon className="w-12 h-12 mx-auto text-foreground/30" />
      <h3 className="mt-4 text-xl font-medium">No films yet</h3>
      <p className="mt-2 text-foreground/70">
        You haven't submitted any films to the marketplace.
      </p>
      <Button 
        onClick={onSubmitClick} 
        className="mt-6"
      >
        Submit Your First Film
      </Button>
    </div>
  );
};

export default EmptyFilmsList;
