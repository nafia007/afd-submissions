import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export const TrendingPosts = () => {
  const { data: trendingPosts, isLoading } = useQuery({
    queryKey: ['trending-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, post_type, likes_count, comments_count, created_at, tags')
        .order('likes_count', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-5 h-5 text-accent" />
          Trending Posts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground text-sm">Loading...</div>
        ) : !trendingPosts || trendingPosts.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-sm">No trending posts yet</div>
        ) : (
          trendingPosts.map((post, index) => (
            <div 
              key={post.id} 
              className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  #{index + 1}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-2 mb-1">
                    {post.title || post.content.slice(0, 60)}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.likes_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.comments_count}
                    </span>
                  </div>
                </div>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.slice(0, 2).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
