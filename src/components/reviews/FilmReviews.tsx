
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MessageSquare, Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Review {
  id: string;
  film_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  helpful_count: number;
}

interface FilmReviewsProps {
  filmId: string;
}

const FilmReviews = ({ filmId }: FilmReviewsProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [submitting, setSubmitting] = useState<boolean>(false);
  
  // Check if user is authenticated
  useState(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => subscription.unsubscribe();
  });
  
  const { data: reviews, isLoading, refetch } = useQuery({
    queryKey: ['filmReviews', filmId],
    queryFn: async (): Promise<Review[]> => {
      const { data, error } = await supabase
        .from('film_reviews')
        .select(`
          *,
          profiles (*)
        `)
        .eq('film_id', filmId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    }
  });
  
  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to leave a review");
      return;
    }
    
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }
    
    try {
      setSubmitting(true);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("Authentication required");
        return;
      }
      
      const { error } = await supabase
        .from('film_reviews')
        .insert({
          film_id: filmId,
          user_id: session.session.user.id,
          rating,
          comment,
          helpful_count: 0
        });
        
      if (error) throw error;
      
      setComment("");
      setRating(5);
      refetch();
      toast.success("Review submitted successfully");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleMarkHelpful = async (reviewId: string) => {
    try {
      const { data, error } = await supabase
        .from('film_reviews')
        .select('helpful_count')
        .eq('id', reviewId)
        .single();
        
      if (error) throw error;
      
      const newCount = (data.helpful_count || 0) + 1;
      
      const { error: updateError } = await supabase
        .from('film_reviews')
        .update({ helpful_count: newCount })
        .eq('id', reviewId);
        
      if (updateError) throw updateError;
      
      refetch();
      toast.success("Marked as helpful");
    } catch (error) {
      console.error("Error marking review as helpful:", error);
      toast.error("Failed to mark review as helpful");
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-heading font-semibold mb-6 flex items-center">
        <MessageSquare className="w-5 h-5 mr-2" />
        Reviews and Comments
      </h2>
      
      <div className="mb-8">
        <div className="mb-4">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star 
                  className={`w-5 h-5 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-foreground/30'}`} 
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Share your thoughts about this film..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none"
            rows={4}
            disabled={!isAuthenticated || submitting}
          />
        </div>
        <Button 
          onClick={handleSubmitReview} 
          disabled={!isAuthenticated || submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
        {!isAuthenticated && (
          <p className="text-sm text-foreground/70 mt-2">
            Please <a href="/login" className="text-primary hover:underline">login</a> to leave a review
          </p>
        )}
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p>Loading reviews...</p>
        </div>
      ) : reviews?.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <MessageSquare className="h-10 w-10 mx-auto mb-2 text-foreground/30" />
          <p className="text-foreground/70">No reviews yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews?.map((review) => (
            <div key={review.id} className="border-b border-border/50 pb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-foreground/30'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/70">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleMarkHelpful(review.id)}
                  className="text-foreground/70 hover:text-foreground"
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {review.helpful_count || 0}
                </Button>
              </div>
              <p className="mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilmReviews;
