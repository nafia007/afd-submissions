import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Plus, Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Story {
  id: string;
  user_id: string;
  username: string;
  avatar?: string;
  hasStory: boolean;
  isViewed: boolean;
}

export const StoriesBar = () => {
  const { user } = useAuthState();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  // Get users who have posted recently (simulating stories)
  const { data: activeUsers = [] } = useQuery({
    queryKey: ['story-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('user_id, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get unique users
      const uniqueUsers = [...new Set(data?.map(p => p.user_id) || [])];
      
      return uniqueUsers.slice(0, 15).map((userId, i) => ({
        id: userId,
        user_id: userId,
        username: `User ${userId.slice(0, 6)}`,
        avatar: undefined,
        hasStory: true,
        isViewed: i > 3,
      }));
    },
  });

  return (
    <>
      <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-border/50">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4">
            {/* Add Story Button */}
            {user && (
              <div className="flex flex-col items-center gap-1 cursor-pointer group">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-dashed border-primary/50 group-hover:border-primary transition-colors">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">Your Story</span>
              </div>
            )}

            {/* Stories */}
            {activeUsers.map((story) => (
              <div
                key={story.id}
                className="flex flex-col items-center gap-1 cursor-pointer group"
                onClick={() => setSelectedStory(story)}
              >
                <div className={cn(
                  "p-0.5 rounded-full",
                  story.isViewed 
                    ? "bg-muted" 
                    : "bg-gradient-to-br from-primary via-accent to-primary"
                )}>
                  <div className="p-0.5 bg-background rounded-full">
                    <Avatar className="w-14 h-14 group-hover:scale-105 transition-transform">
                      <AvatarImage src={story.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 text-foreground font-semibold">
                        {story.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground truncate max-w-16">
                  {story.username}
                </span>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Story Viewer Modal */}
      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-md h-[80vh] p-0 bg-black overflow-hidden">
          <DialogTitle className="sr-only">Story from {selectedStory?.username}</DialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Story progress bars */}
            <div className="absolute top-0 left-0 right-0 p-2 flex gap-1 z-10">
              <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full w-full bg-white animate-[progress_5s_linear]" />
              </div>
            </div>
            
            {/* User info */}
            <div className="absolute top-6 left-4 flex items-center gap-3 z-10">
              <Avatar className="w-10 h-10 border-2 border-white">
                <AvatarFallback>{selectedStory?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-medium text-sm">{selectedStory?.username}</p>
                <p className="text-white/60 text-xs">Just now</p>
              </div>
            </div>

            {/* Story Content Placeholder */}
            <div className="flex flex-col items-center gap-4 text-white/70">
              <Play className="w-16 h-16" />
              <p className="text-sm">Story content</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
