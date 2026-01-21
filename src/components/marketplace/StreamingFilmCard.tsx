import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Trash2, ImageOff, ShoppingCart, Tv } from "lucide-react";
import { Film } from "@/types/film";
import VideoPlayer from "@/components/VideoPlayer";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import PurchaseDialog from "./PurchaseDialog";
import { useNavigate } from "react-router-dom";

interface StreamingFilmCardProps {
  film: Film;
  onDelete?: () => void;
}

const StreamingFilmCard = ({ film, onDelete }: StreamingFilmCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const navigate = useNavigate();

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Use poster URL if available, otherwise use a placeholder
  const posterUrl = film.poster_url || `https://image.tmdb.org/t/p/w500/placeholder-${film.id}.jpg`;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-card border-border">
      <div className="relative aspect-[2/3] overflow-hidden">
        {!imageError ? (
          <img
            src={posterUrl}
            alt={film.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <ImageOff className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Overlay with play button */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {film.video_url && (
            <VideoPlayer url={film.video_url} title={film.title} />
          )}
        </div>

        {/* Admin delete button */}
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Film</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{film.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {/* Genre badge */}
        {film.genre && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 left-2 bg-background/80 text-foreground"
          >
            {film.genre}
          </Badge>
        )}
      </div>

      <CardContent className="p-2 md:p-3">
        <h3 className="font-semibold text-xs md:text-sm line-clamp-2 mb-1">{film.title}</h3>
        <p className="text-xs text-muted-foreground mb-1 truncate">Dir. {film.director}</p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="text-sm font-bold text-accent">${film.price}</div>
          {film.duration_minutes && (
            <p className="text-xs text-muted-foreground hidden sm:block">
              {Math.floor(film.duration_minutes / 60)}h {film.duration_minutes % 60}m
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 mt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => setShowPurchaseDialog(true)}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Buy
          </Button>
          <Button
            size="sm"
            className="flex-1 text-xs bg-accent hover:bg-accent/90"
            asChild
          >
            <a href="https://afd-stream.base44.app/Home" target="_blank" rel="noopener noreferrer">
              <Tv className="w-3 h-3 mr-1" />
              AFD TV
            </a>
          </Button>
        </div>
      </CardContent>

      {/* Purchase Dialog */}
      <PurchaseDialog
        film={film}
        open={showPurchaseDialog}
        onOpenChange={setShowPurchaseDialog}
      />
    </Card>
  );
};

export default StreamingFilmCard;