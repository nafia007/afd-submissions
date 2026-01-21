
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Play, DollarSign, Calendar, User } from "lucide-react";
import { useFilmDetails } from "@/hooks/useFilmDetails";
import { useFilmAverageRating } from "@/hooks/useFilmReviews";
import FilmReviews from "@/components/reviews/FilmReviews";
import RevenueDistribution from "@/components/revenue/RevenueDistribution";

const FilmDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: film, isLoading } = useFilmDetails(id);
  const { data: averageRating } = useFilmAverageRating(id || "");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="text-center py-12">
          <p>Loading film details...</p>
        </div>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="text-center py-12">
          <p>Film not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-heading mb-2">{film.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-foreground/70">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {film.director}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(film.created_at).getFullYear()}
                    </span>
                    {averageRating && averageRating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        {averageRating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant="outline">
                  {film.completion_status?.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 mb-6">{film.description}</p>
              
              {film.video_url && (
                <div className="mb-6">
                  <Button className="gap-2">
                    <Play className="w-4 h-4" />
                    Watch Trailer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="reviews" className="w-full">
            <TabsList>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <FilmReviews filmId={film.id} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="revenue" className="mt-6">
              <RevenueDistribution filmId={film.id} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Investment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-foreground/70">Price per Token</p>
                <p className="text-2xl font-bold">{film.price} ETH</p>
              </div>
              
              {film.budget && (
                <div>
                  <p className="text-sm text-foreground/70">Total Budget</p>
                  <p className="text-lg font-semibold">${film.budget}</p>
                </div>
              )}
              
              {film.genre && (
                <div>
                  <p className="text-sm text-foreground/70">Genre</p>
                  <Badge variant="secondary">{film.genre}</Badge>
                </div>
              )}
              
              <Button className="w-full" size="lg">
                Invest in Film
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FilmDetails;
