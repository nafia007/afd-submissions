import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { MessagesPanel } from "./MessagesPanel";

export const MessageButton = () => {
  const { user } = useAuthState();
  const [isOpen, setIsOpen] = useState(false);

  // Count unread messages
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-messages-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
    refetchInterval: 10000 // Check every 10 seconds
  });

  if (!user) return null;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="icon"
        className="relative bg-card border-primary/20 hover:bg-primary/10 hover:border-primary/40"
      >
        <MessageSquare className="w-5 h-5 text-primary" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      
      <MessagesPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
