import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, X, Check, CheckCheck } from "lucide-react";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  subject: string;
  is_read: boolean;
  created_at: string;
}

interface ChatWindowProps {
  conversation: {
    other_user_id: string;
    other_user_name: string;
    other_user_image: string;
  };
  onBack: () => void;
  onClose: () => void;
}

export const ChatWindow = ({ conversation, onBack, onClose }: ChatWindowProps) => {
  const { user } = useAuthState();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Fetch messages for this conversation
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chat-messages', user?.id, conversation.other_user_id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${conversation.other_user_id}),and(sender_id.eq.${conversation.other_user_id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Message[];
    },
    enabled: !!user,
    refetchInterval: 3000 // Poll for new messages
  });

  // Mark messages as read
  useEffect(() => {
    if (!user || messages.length === 0) return;
    
    const unreadMessages = messages.filter(
      msg => msg.receiver_id === user.id && !msg.is_read
    );
    
    if (unreadMessages.length > 0) {
      supabase
        .from('messages')
        .update({ is_read: true })
        .in('id', unreadMessages.map(m => m.id))
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['user-conversations'] });
        });
    }
  }, [messages, user, queryClient]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: conversation.other_user_id,
          content,
          subject: 'Direct Message',
          is_read: false
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ['chat-messages', user?.id, conversation.other_user_id] });
      queryClient.invalidateQueries({ queryKey: ['user-conversations'] });
    },
    onError: (error: any) => {
      toast.error("Failed to send message: " + error.message);
    }
  });

  const handleSend = () => {
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups: Record<string, Message[]>, message) => {
    const date = formatMessageDate(new Date(message.created_at));
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
        <Button variant="ghost" size="icon" onClick={onBack} className="lg:flex">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarImage 
            src={conversation.other_user_image?.startsWith('http') 
              ? conversation.other_user_image 
              : conversation.other_user_image ? `https://images.unsplash.com/${conversation.other_user_image}` : undefined
            } 
          />
          <AvatarFallback>{conversation.other_user_name?.slice(0, 2).toUpperCase() || '??'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">{conversation.other_user_name}</h3>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground mb-2">No messages yet</p>
            <p className="text-sm text-muted-foreground/70">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date separator */}
                <div className="flex items-center justify-center my-4">
                  <span className="px-3 py-1 text-xs text-muted-foreground bg-muted rounded-full">
                    {date}
                  </span>
                </div>
                
                {/* Messages for this date */}
                {dateMessages.map((message, index) => {
                  const isSent = message.sender_id === user?.id;
                  const showAvatar = index === 0 || 
                    dateMessages[index - 1].sender_id !== message.sender_id;
                  
                  return (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-2 mb-2",
                        isSent ? "justify-end" : "justify-start"
                      )}
                    >
                      {!isSent && showAvatar && (
                        <Avatar className="w-8 h-8 mt-auto">
                          <AvatarImage 
                            src={conversation.other_user_image?.startsWith('http') 
                              ? conversation.other_user_image 
                              : conversation.other_user_image ? `https://images.unsplash.com/${conversation.other_user_image}` : undefined
                            } 
                          />
                          <AvatarFallback className="text-xs">
                            {conversation.other_user_name?.slice(0, 2).toUpperCase() || '??'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {!isSent && !showAvatar && <div className="w-8" />}
                      
                      <div
                        className={cn(
                          "max-w-[70%] px-4 py-2 rounded-2xl",
                          isSent 
                            ? "bg-primary text-primary-foreground rounded-br-md" 
                            : "bg-muted rounded-bl-md"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        <div className={cn(
                          "flex items-center gap-1 mt-1",
                          isSent ? "justify-end" : "justify-start"
                        )}>
                          <span className={cn(
                            "text-[10px]",
                            isSent ? "text-primary-foreground/70" : "text-muted-foreground"
                          )}>
                            {format(new Date(message.created_at), 'HH:mm')}
                          </span>
                          {isSent && (
                            message.is_read 
                              ? <CheckCheck className="w-3 h-3 text-primary-foreground/70" />
                              : <Check className="w-3 h-3 text-primary-foreground/70" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-muted/50"
            disabled={sendMessageMutation.isPending}
          />
          <Button 
            size="icon" 
            onClick={handleSend}
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
