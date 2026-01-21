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
import { 
  Heart, 
  MessageCircle, 
  Share, 
  FileText, 
  Briefcase, 
  DollarSign, 
  Star,
  UserCircle,
  ExternalLink,
  MapPin,
  Wallet,
  Trash2,
  Download,
  FileIcon
} from "lucide-react";
import { toast } from "sonner";

interface Attachment {
  url: string;
  name: string;
  type: 'image' | 'file';
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

interface PostCardProps {
  post: Post;
}

const POST_TYPE_CONFIG = {
  general: { icon: FileText, color: 'bg-slate-100 text-slate-700', label: 'Discussion' },
  news: { icon: FileText, color: 'bg-blue-100 text-blue-700', label: 'News' },
  funding: { icon: DollarSign, color: 'bg-green-100 text-green-700', label: 'Funding' },
  jobs: { icon: Briefcase, color: 'bg-purple-100 text-purple-700', label: 'Job' },
  showcase: { icon: Star, color: 'bg-yellow-100 text-yellow-700', label: 'Showcase' },
};

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuthState();
  const { isAdmin } = useAdminCheck();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const queryClient = useQueryClient();

  const typeConfig = POST_TYPE_CONFIG[post.post_type];

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

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <UserCircle className="w-10 h-10 text-muted-foreground" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {post.user_id.slice(0, 8)}
                </span>
                <Badge className={`${typeConfig.color} text-xs`}>
                  <typeConfig.icon className="w-3 h-3 mr-1" />
                  {typeConfig.label}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(post.created_at).toLocaleString()}
              </span>
            </div>
          </div>
          
          {/* Admin delete button */}
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deletePost()}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Title */}
        {post.title && (
          <h3 className="font-semibold text-lg leading-tight">{post.title}</h3>
        )}

        {/* Content */}
        <div className="text-foreground whitespace-pre-line leading-relaxed">
          {post.content}
        </div>

        {/* Attachments */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="space-y-2">
            {/* Images */}
            {post.attachments.filter(a => a.type === 'image').length > 0 && (
              <div className={`grid gap-2 ${
                post.attachments.filter(a => a.type === 'image').length === 1 
                  ? 'grid-cols-1' 
                  : post.attachments.filter(a => a.type === 'image').length === 2
                  ? 'grid-cols-2'
                  : 'grid-cols-2 sm:grid-cols-3'
              }`}>
                {post.attachments
                  .filter(a => a.type === 'image')
                  .map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md overflow-hidden border hover:opacity-90 transition-opacity"
                    >
                      <img
                        src={attachment.url}
                        alt={attachment.name}
                        className="w-full h-48 object-cover"
                      />
                    </a>
                  ))}
              </div>
            )}

            {/* File attachments */}
            {post.attachments.filter(a => a.type === 'file').length > 0 && (
              <div className="space-y-2">
                {post.attachments
                  .filter(a => a.type === 'file')
                  .map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment.url}
                      download={attachment.name}
                      className="flex items-center gap-2 p-3 border rounded-md hover:bg-muted/50 transition-colors group"
                    >
                      <FileIcon className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{attachment.name}</p>
                        <p className="text-xs text-muted-foreground">{attachment.mime_type}</p>
                      </div>
                      <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Job/Funding specific info */}
        {post.post_type === 'jobs' && (post.job_location || post.job_salary) && (
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            {post.job_location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {post.job_location}
              </div>
            )}
            {post.job_salary && (
              <div className="flex items-center gap-1">
                <Wallet className="w-4 h-4" />
                {post.job_salary}
              </div>
            )}
          </div>
        )}

        {post.post_type === 'funding' && post.funding_amount && (
          <div className="text-sm text-green-600 font-medium">
            Funding: {post.funding_amount}
          </div>
        )}

        {/* External link */}
        {post.external_url && (
          <a
            href={post.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Learn more
          </a>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <Separator />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleLike()}
              className="gap-2 hover:text-red-500"
              disabled={!user}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              {post.likes_count}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              {post.comments_count}
            </Button>

            <Button variant="ghost" size="sm" className="gap-2">
              <Share className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-4 pt-4 border-t">
            {/* Add comment form */}
            {user && (
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 min-h-[60px]"
                  disabled={commentPending}
                />
                <Button 
                  type="submit" 
                  disabled={commentPending || !newComment.trim()}
                  size="sm"
                  className="self-end"
                >
                  Post
                </Button>
              </form>
            )}

            {/* Comments list */}
            {commentsLoading ? (
              <div className="text-center text-muted-foreground">Loading comments...</div>
            ) : comments.length > 0 ? (
              <div className="space-y-3">
                {comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <UserCircle className="w-6 h-6 text-muted-foreground shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {comment.user_id.slice(0, 8)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-foreground whitespace-pre-line">
                        {comment.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}