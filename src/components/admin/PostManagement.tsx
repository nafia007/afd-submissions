import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Edit, FileText, Briefcase, DollarSign, Star } from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: string;
  user_id: string;
  post_type: 'general' | 'news' | 'funding' | 'jobs' | 'showcase';
  title?: string;
  content: string;
  tags: string[];
  likes_count: number;
  comments_count: number;
  funding_amount?: string;
  job_location?: string;
  job_salary?: string;
  external_url?: string;
  created_at: string;
}

interface NewPostData {
  post_type: 'general' | 'news' | 'funding' | 'jobs' | 'showcase';
  title?: string;
  content: string;
  tags: string[];
  funding_amount?: string;
  job_location?: string;
  job_salary?: string;
  external_url?: string;
}

const POST_TYPES = [
  { value: 'general', label: 'General Discussion', icon: FileText },
  { value: 'news', label: 'Film News', icon: FileText },
  { value: 'funding', label: 'Funding Opportunity', icon: DollarSign },
  { value: 'jobs', label: 'Job Posting', icon: Briefcase },
  { value: 'showcase', label: 'Showcase Work', icon: Star },
];

export function PostManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState<NewPostData>({
    post_type: 'general',
    content: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const queryClient = useQueryClient();

  // Fetch all posts
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Post[];
    },
  });

  // Create post mutation
  const { mutate: createPost, isPending: creating } = useMutation({
    mutationFn: async (data: NewPostData) => {
      const { error } = await supabase.from("posts").insert({
        ...data,
        user_id: '00000000-0000-0000-0000-000000000000', // Admin placeholder
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewPost({ post_type: 'general', content: '', tags: [] });
      setShowCreateForm(false);
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast.success("Post created successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Could not create post.");
    },
  });

  // Delete post mutation
  const { mutate: deletePost } = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] });
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast.success("Post deleted successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Could not delete post.");
    },
  });

  const addTag = () => {
    if (tagInput.trim() && !newPost.tags.includes(tagInput.trim()) && newPost.tags.length < 5) {
      setNewPost(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewPost(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.content.trim()) return;
    createPost(newPost);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Community Post Management</h3>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Post
        </Button>
      </div>

      {/* Create Post Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select 
                value={newPost.post_type} 
                onValueChange={(value) => setNewPost(prev => ({ ...prev, post_type: value as NewPostData['post_type'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select post type" />
                </SelectTrigger>
                <SelectContent>
                  {POST_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {newPost.post_type !== 'general' && (
                <Input
                  placeholder="Post title..."
                  value={newPost.title || ''}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                />
              )}

              <Textarea
                placeholder="Post content..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                maxLength={2000}
                className="min-h-[120px]"
                disabled={creating}
              />

              {newPost.post_type === 'funding' && (
                <Input
                  placeholder="Funding amount (e.g., $10K - $50K)"
                  value={newPost.funding_amount || ''}
                  onChange={(e) => setNewPost(prev => ({ ...prev, funding_amount: e.target.value }))}
                />
              )}

              {newPost.post_type === 'jobs' && (
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Location"
                    value={newPost.job_location || ''}
                    onChange={(e) => setNewPost(prev => ({ ...prev, job_location: e.target.value }))}
                  />
                  <Input
                    placeholder="Salary range"
                    value={newPost.job_salary || ''}
                    onChange={(e) => setNewPost(prev => ({ ...prev, job_salary: e.target.value }))}
                  />
                </div>
              )}

              <Input
                placeholder="External link (optional)"
                value={newPost.external_url || ''}
                onChange={(e) => setNewPost(prev => ({ ...prev, external_url: e.target.value }))}
                type="url"
              />

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tags..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addTag} variant="outline" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {newPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {newPost.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-xs hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={creating || !newPost.content.trim()}
                >
                  {creating ? "Creating..." : "Create Post"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No posts found</div>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {POST_TYPES.find(t => t.value === post.post_type)?.label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.created_at).toLocaleString()}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletePost(post.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {post.title && (
                  <h4 className="font-medium mb-2">{post.title}</h4>
                )}

                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {post.content}
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{post.likes_count} likes</span>
                  <span>{post.comments_count} comments</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}