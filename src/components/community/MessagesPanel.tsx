import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Search, X, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ChatWindow } from "./ChatWindow";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_image: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface MessagesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessagesPanel = ({ isOpen, onClose }: MessagesPanelProps) => {
  const { user } = useAuthState();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Fetch all conversations (grouped messages by user)
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['user-conversations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get all messages where user is sender or receiver
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Group by other user
      const conversationMap = new Map<string, any>();
      
      for (const msg of messages || []) {
        const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            other_user_id: otherUserId,
            last_message: msg.content,
            last_message_time: msg.created_at,
            unread_count: msg.receiver_id === user.id && !msg.is_read ? 1 : 0
          });
        } else if (msg.receiver_id === user.id && !msg.is_read) {
          const conv = conversationMap.get(otherUserId);
          conv.unread_count++;
        }
      }
      
      // Fetch user profiles for the other users
      const otherUserIds = Array.from(conversationMap.keys());
      if (otherUserIds.length === 0) return [];
      
      const { data: profiles } = await supabase
        .from('filmmaker_profiles_extended')
        .select('id, name, image')
        .in('id', otherUserIds);
      
      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
      
      return Array.from(conversationMap.entries()).map(([userId, conv]) => {
        const profile = profileMap.get(userId);
        return {
          id: userId,
          other_user_id: userId,
          other_user_name: profile?.name || 'Unknown User',
          other_user_image: profile?.image || '',
          last_message: conv.last_message,
          last_message_time: conv.last_message_time,
          unread_count: conv.unread_count
        };
      });
    },
    enabled: !!user && isOpen,
    refetchInterval: 5000 // Poll every 5 seconds for new messages
  });

  // Fetch all users for starting new conversations
  const { data: allUsers = [] } = useQuery({
    queryKey: ['all-filmmakers-for-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('filmmaker_profiles_extended')
        .select('id, name, image, role')
        .neq('id', user?.id || '')
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && isOpen && searchQuery.length > 0
  });

  const filteredUsers = searchQuery 
    ? allUsers.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const startNewConversation = (otherUser: any) => {
    setSelectedConversation({
      id: otherUser.id,
      other_user_id: otherUser.id,
      other_user_name: otherUser.name,
      other_user_image: otherUser.image,
      last_message: '',
      last_message_time: new Date().toISOString(),
      unread_count: 0
    });
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:relative lg:inset-auto lg:bg-transparent lg:backdrop-blur-none">
      <div className={cn(
        "fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl",
        "lg:relative lg:right-auto lg:top-auto lg:h-[600px] lg:rounded-lg lg:border"
      )}>
        {selectedConversation ? (
          <ChatWindow 
            conversation={selectedConversation}
            onBack={() => setSelectedConversation(null)}
            onClose={onClose}
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-lg">Messages</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search or start new chat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50"
                />
              </div>
            </div>

            {/* Search Results */}
            {searchQuery && filteredUsers.length > 0 && (
              <div className="border-b border-border">
                <p className="px-4 py-2 text-xs text-muted-foreground font-medium">Start new chat</p>
                <ScrollArea className="max-h-40">
                  {filteredUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => startNewConversation(u)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={u.image?.startsWith('http') ? u.image : u.image ? `https://images.unsplash.com/${u.image}` : undefined} />
                        <AvatarFallback>{u.name?.slice(0, 2).toUpperCase() || '??'}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-medium text-sm">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.role}</p>
                      </div>
                    </button>
                  ))}
                </ScrollArea>
              </div>
            )}

            {/* Conversations List */}
            <ScrollArea className="flex-1 h-[calc(100%-140px)]">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No conversations yet</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Search for a member to start chatting
                  </p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors border-b border-border/50"
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conv.other_user_image?.startsWith('http') ? conv.other_user_image : conv.other_user_image ? `https://images.unsplash.com/${conv.other_user_image}` : undefined} />
                        <AvatarFallback>{conv.other_user_name?.slice(0, 2).toUpperCase() || '??'}</AvatarFallback>
                      </Avatar>
                      {conv.unread_count > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conv.other_user_name}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conv.last_message_time), { addSuffix: false })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.last_message}</p>
                    </div>
                  </button>
                ))
              )}
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  );
};
