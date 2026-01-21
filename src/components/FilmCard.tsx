import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Film, Trash2, ImageOff } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
interface FilmCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  director: string;
  videoUrl?: string;
  imageUrl?: string;
  genre?: string;
  onDelete?: () => void;
}
const FilmCard = ({
  id,
  title,
  description,
  price,
  director,
  videoUrl = "",
  imageUrl,
  genre = "Drama",
  onDelete
}: FilmCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };
  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Fallback image or placeholder
  const displayImage = imageUrl || `https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80`;
  
  return (
    <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10">
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden">
          {!imageError ? (
            <img 
              src={displayImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <ImageOff className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          {imageLoading && !imageError && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-background/80 text-foreground">
              {genre}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <CardTitle className="text-lg font-bold text-foreground line-clamp-1">
              {title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">by {director}</p>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <div className="text-lg font-bold text-accent">
              ${price}
            </div>
            <div className="flex gap-2">
              <Button 
                asChild
                className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground"
              >
                <a href="https://afd-stream.base44.app/Home" target="_blank" rel="noopener noreferrer">
                  <Film className="w-4 h-4 mr-2" />
                  AFD TV beta
                </a>
              </Button>
              {onDelete && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={onDelete}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          
          {videoUrl && (
            <div className="pt-2">
              <VideoPlayer url={videoUrl} title={title} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default FilmCard;