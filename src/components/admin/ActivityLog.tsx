import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Film, User, MessageCircle, FileText } from "lucide-react";

export const ActivityLog = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['admin-activity-log'],
    queryFn: async () => {
      // Fetch recent activities from various tables
      const [filmsRes, postsRes, submissionsRes] = await Promise.all([
        supabase.from('films').select('id, title, created_at, user_id').order('created_at', { ascending: false }).limit(10),
        supabase.from('posts').select('id, title, content, created_at, user_id, post_type').order('created_at', { ascending: false }).limit(10),
        supabase.from('afd_submissions').select('id, title, created_at, user_id, approval_status').order('created_at', { ascending: false }).limit(10),
      ]);

      const activities = [
        ...(filmsRes.data || []).map(f => ({ type: 'film', ...f })),
        ...(postsRes.data || []).map(p => ({ type: 'post', ...p })),
        ...(submissionsRes.data || []).map(s => ({ type: 'submission', ...s })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 20);

      return activities;
    },
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'film': return <Film className="w-4 h-4" />;
      case 'post': return <MessageCircle className="w-4 h-4" />;
      case 'submission': return <FileText className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'film': return 'bg-blue-100 text-blue-700';
      case 'post': return 'bg-green-100 text-green-700';
      case 'submission': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading activities...</div>
          ) : !activities || activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No recent activity</div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity: any) => (
                <div key={`${activity.type}-${activity.id}`} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Badge className={`${getActivityColor(activity.type)} mt-1`}>
                    {getActivityIcon(activity.type)}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium text-sm capitalize truncate">
                        {activity.type === 'film' && `New film: ${activity.title}`}
                        {activity.type === 'post' && `New ${activity.post_type} post${activity.title ? `: ${activity.title}` : ''}`}
                        {activity.type === 'submission' && `New submission: ${activity.title}`}
                      </span>
                      {activity.approval_status && (
                        <Badge variant="outline" className="text-xs">
                          {activity.approval_status}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span className="truncate">{activity.user_id?.slice(0, 8)}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{new Date(activity.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
