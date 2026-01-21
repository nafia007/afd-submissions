import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  MoreHorizontal,
  FileText, 
  Briefcase, 
  DollarSign, 
  Star,
  ExternalLink,
  MapPin,
  Wallet,
  Trash2,
  Download,
  FileIcon,
  Send,
  Mail
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { MessagesPanel } from "./MessagesPanel";

interface Attachment {
  url: string;
  name: string;
  type: 'image' | 'video' | 'file';
  mime_type: string;
}

interface Post {
  id: string;
  user_id: string;
  post_type: 'general' | 'news' | 'funding' | 'jobs' | 'showcase';
  title?: string;
  content: string;
  image_url?: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  funding_amount?: string;
  job_location?: string;
  job_salary?: string;
  external_url?: string;
  created_at: string;
  attachments?: Attachment[];
}

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface EnhancedPostCardProps {
  post: Post;
}

const POST_TYPE_CONFIG = {
  general: { icon: FileText, color: 'bg-muted text-muted-foreground', label: 'Discussion' },
  news: { icon: FileText, color: 'bg-blue-500/10 text-blue-500', label: 'News' },
  funding: { icon: DollarSign, color: 'bg-green-500/10 text-green-500', label: 'Funding' },
  jobs: { icon: Briefcase, color: 'bg-purple-500/10 text-purple-500', label: 'Job' },
  showcase: { icon: Star, color: 'bg-amber-500/10 text-amber-500', label: 'Showcase' },
};

export default function EnhancedPostCard({ post }: EnhancedPostCardProps) {
  const { user } = useAuthState();
  const { isAdmin } = useAdminCheck();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showMessagePanel, setShowMessagePanel] = useState(false);
  const queryClient = useQueryClient();

  const typeConfig = POST_TYPE_CONFIG[post.post_type];
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  // Check if user has liked the post
  useQuery({
    queryKey: ['post-reaction', post.id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from('post_reactions')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .eq('reaction_type', 'like')
        .maybeSingle();
      setIsLiked(!!data);
      return !!data;
    },
    enabled: !!user,
  });

  // Fetch comments when shown
  const { data: comments = [], isLoading: commentsLoading } = useQuery<Comment[]>({
    queryKey: ['post-comments', post.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as Comment[];
    },
    enabled: showComments,
  });

  // Like/unlike mutation
  const { mutate: toggleLike } = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Please sign in to like posts");

      if (isLiked) {
        const { error } = await supabase
          .from('post_reactions')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id)
          .eq('reaction_type', 'like');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('post_reactions')
          .insert({
            post_id: post.id,
            user_id: user.id,
            reaction_type: 'like',
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Could not update like");
    },
  });

  // Add comment mutation
  const { mutate: addComment, isPending: commentPending } = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error("Please sign in to comment");
      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: post.id,
          user_id: user.id,
          content,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewComment('');
      queryClient.invalidateQueries({ queryKey: ['post-comments', post.id] });
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast.success("Comment added!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Could not add comment");
    },
  });

  // Delete post mutation (admin only)
  const { mutate: deletePost } = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast.success("Post deleted successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Could not delete post");
    },
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(newComment.trim());
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/community?post=${post.id}`);
    toast.success("Link copied to clipboard!");
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from saved" : "Saved to collection!");
  };

  const handleMessage = () => {
    if (!user) {
      toast.error("Please log in to send messages");
      return;
    }
    if (user.id === post.user_id) {
      toast.info("You can't message yourself");
      return;
    }
    setShowMessagePanel(true);
  };

  return (
    <Card className="w-full border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card transition-colors overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="w-11 h-11 ring-2 ring-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary/40 to-accent/40 font-semibold">
                {post.user_id.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm hover:text-primary cursor-pointer transition-colors">
                  @{post.user_id.slice(0, 8)}
                </span>
                <Badge className={`${typeConfig.color} text-[10px] px-1.5 py-0 font-medium border-0`}>
                  {typeConfig.label}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSave}>
                <Bookmark className="w-4 h-4 mr-2" />
                {isSaved ? 'Unsave' : 'Save'}
              </DropdownMenuItem>
              {user && user.id !== post.user_id && (
                <DropdownMenuItem onClick={handleMessage}>
                  <Mail className="w-4 h-4 mr-2" />
                  Message Author
                </DropdownMenuItem>
              )}
              {isAdmin && (
                <DropdownMenuItem onClick={() => deletePost()} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        {post.title && (
          <h3 className="font-semibold text-lg px-4 mb-2">{post.title}</h3>
        )}

        {/* Content */}
        <div className="px-4 pb-3 text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
          {post.content}
        </div>

        {/* Job/Funding specific info */}
        {post.post_type === 'jobs' && (post.job_location || post.job_salary) && (
          <div className="flex flex-wrap gap-3 px-4 pb-3 text-sm">
            {post.job_location && (
              <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5" />
                {post.job_location}
              </div>
            )}
            {post.job_salary && (
              <div className="flex items-center gap-1.5 text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                <Wallet className="w-3.5 h-3.5" />
                {post.job_salary}
              </div>
            )}
          </div>
        )}

        {post.post_type === 'funding' && post.funding_amount && (
          <div className="px-4 pb-3">
            <span className="text-sm text-green-500 font-medium bg-green-500/10 px-3 py-1 rounded-full">
              💰 {post.funding_amount}
            </span>
          </div>
        )}

        {/* External link */}
        {post.external_url && (
          <a
            href={post.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-primary hover:underline text-sm px-4 pb-3"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View more
          </a>
        )}

        {/* Attachments - Images */}
        {post.attachments && post.attachments.filter(a => a.type === 'image').length > 0 && (
          <div className={`grid gap-0.5 ${
            post.attachments.filter(a => a.type === 'image').length === 1 
              ? 'grid-cols-1' 
              : 'grid-cols-2'
          }`}>
            {post.attachments
              .filter(a => a.type === 'image')
              .slice(0, 4)
              .map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative overflow-hidden hover:opacity-90 transition-opacity aspect-square"
                >
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="w-full h-full object-cover"
                  />
                </a>
              ))}
          </div>
        )}

        {/* Attachments - Videos */}
        {post.attachments && post.attachments.filter(a => a.type === 'video').length > 0 && (
          <div className="px-4 pb-3 space-y-2">
            {post.attachments
              .filter(a => a.type === 'video')
              .map((attachment, index) => (
                <div key={index} className="rounded-lg overflow-hidden bg-black">
                  <video
                    src={attachment.url}
                    controls
                    controlsList="nodownload"
                    disablePictureInPicture
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full max-h-[400px]"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))}
          </div>
        )}

        {/* File attachments */}
        {post.attachments && post.attachments.filter(a => a.type === 'file').length > 0 && (
          <div className="px-4 pb-3 space-y-2">
            {post.attachments
              .filter(a => a.type === 'file')
              .map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.url}
                  download={attachment.name}
                  className="flex items-center gap-2 p-2.5 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <FileIcon className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{attachment.name}</p>
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-4 pb-3">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs text-primary hover:text-primary/80 cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Engagement Stats */}
        {(post.likes_count > 0 || post.comments_count > 0) && (
          <div className="flex items-center gap-4 px-4 pb-2 text-xs text-muted-foreground">
            {post.likes_count > 0 && (
              <span>{post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}</span>
            )}
            {post.comments_count > 0 && (
              <span>{post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}</span>
            )}
          </div>
        )}

        <Separator className="opacity-50" />

        {/* Actions */}
        <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleLike()}
              className={`gap-2 hover:text-red-500 ${isLiked ? 'text-red-500' : ''}`}
              disabled={!user}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Like</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Comment</span>
            </Button>

            <Button variant="ghost" size="sm" onClick={handleShare} className="gap-2">
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className={isSaved ? 'text-primary' : ''}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="border-t border-border/50 p-4 space-y-4 bg-muted/20">
            {/* Add comment form */}
            {user && (
              <form onSubmit={handleCommentSubmit} className="flex gap-3 items-start">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-br from-primary/30 to-accent/30 text-xs">
                    {user.id.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[40px] max-h-[120px] bg-background/50 resize-none"
                    disabled={commentPending}
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    disabled={commentPending || !newComment.trim()}
                    className="shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            )}

            {/* Comments list */}
            {commentsLoading ? (
              <div className="text-center text-muted-foreground text-sm py-4">Loading comments...</div>
            ) : comments.length > 0 ? (
              <div className="space-y-3">
                {comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-xs">
                        {comment.user_id.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-background/50 rounded-xl px-3 py-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium">@{comment.user_id.slice(0, 8)}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="text-sm text-foreground/90 whitespace-pre-line">
                        {comment.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm py-4">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      {/* Messages Panel - opens when user clicks message on a post */}
      {showMessagePanel && (
        <MessagesPanel 
          isOpen={showMessagePanel} 
          onClose={() => setShowMessagePanel(false)} 
        />
      )}
    </Card>
  );
}
