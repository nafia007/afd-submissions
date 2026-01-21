import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Heart, MessageCircle, FileText } from "lucide-react";

export const UserEngagementStats = () => {
  const { user } = useAuthState();

  const { data: stats } = useQuery({
    queryKey: ['user-engagement-stats', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const [postsRes, likesRes, commentsRes] = await Promise.all([
        supabase.from('posts').select('id, likes_count').eq('user_id', user.id),
        supabase.from('post_reactions').select('id').eq('user_id', user.id),
        supabase.from('post_comments').select('id').eq('user_id', user.id),
      ]);

      const totalLikesReceived = postsRes.data?.reduce((sum, post) => sum + (post.likes_count || 0), 0) || 0;

      return {
        posts: postsRes.data?.length || 0,
        likesGiven: likesRes.data?.length || 0,
        likesReceived: totalLikesReceived,
        comments: commentsRes.data?.length || 0,
      };
    },
    enabled: !!user,
  });

  if (!user || !stats) return null;

  const engagementScore = stats.posts * 10 + stats.likesReceived * 2 + stats.comments * 5;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="w-5 h-5 text-accent" />
          Your Impact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center pb-4 border-b">
          <div className="text-3xl font-bold text-accent">{engagementScore}</div>
          <div className="text-xs text-muted-foreground mt-1">Engagement Score</div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm">Posts Created</span>
            </div>
            <Badge>{stats.posts}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm">Likes Received</span>
            </div>
            <Badge>{stats.likesReceived}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">Comments Made</span>
            </div>
            <Badge>{stats.comments}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
