import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { MessagesPanel } from "./MessagesPanel";
import { FollowButton } from "./FollowButton";

export const SuggestedUsers = () => {
  const { user } = useAuthState();
  const [messageOpen, setMessageOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data: suggestedUsers = [] } = useQuery({
    queryKey: ['suggested-users', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('filmmaker_showcase')
        .select('id, name, role, profile_image_url')
        .limit(5);

      if (error) throw error;
      return data || [];
    },
  });

  const handleMessage = (filmmaker: any) => {
    if (!user) {
      toast.error("Please log in to send messages");
      return;
    }
    setSelectedUser(filmmaker);
    setMessageOpen(true);
  };

  if (suggestedUsers.length === 0) return null;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Users className="w-4 h-4 text-primary" />
          Suggested Filmmakers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestedUsers.map((filmmaker) => (
          <div key={filmmaker.id} className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={filmmaker.profile_image_url || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 text-xs font-semibold">
                {filmmaker.name?.slice(0, 2).toUpperCase() || '??'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{filmmaker.name || 'Unknown'}</p>
              <p className="text-xs text-muted-foreground truncate">{filmmaker.role || 'Filmmaker'}</p>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-7 w-7"
                onClick={() => handleMessage({
                  id: filmmaker.id,
                  name: filmmaker.name,
                  image: filmmaker.profile_image_url || ''
                })}
                title="Message"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </Button>
              <FollowButton 
                userId={filmmaker.id!} 
                size="sm" 
                className="h-7 text-xs"
              />
            </div>
          </div>
        ))}
      </CardContent>
      
      {/* Messages Panel */}
      {selectedUser && (
        <MessagesPanel 
          isOpen={messageOpen} 
          onClose={() => {
            setMessageOpen(false);
            setSelectedUser(null);
          }} 
        />
      )}
    </Card>
  );
};
