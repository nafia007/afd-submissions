import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import PostCreationForm from "./PostCreationForm";
import EnhancedPostCard from "./EnhancedPostCard";
import CommunityFilters from "./CommunityFilters";
import { StoriesBar } from "./StoriesBar";
import { useFollow } from "@/hooks/useFollow";
import { useAuthState } from "@/hooks/useAuthState";

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
  showcase_submission_id?: string;
  created_at: string;
  attachments?: Array<{
    url: string;
    name: string;
    type: 'image' | 'file';
    mime_type: string;
  }>;
}

export default function CommunityPosts() {
  const { user } = useAuthState();
  const { followingList } = useFollow();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);

  // Fetch all posts with enhanced data
  const { data: posts = [], isLoading, error } = useQuery<Post[]>({
    queryKey: ["community-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          afd_submissions (
            title,
            file_url
          )
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(post => ({
        ...post,
        attachments: post.attachments as any,
      })) as Post[];
    },
  });

  // Get popular tags
  const popularTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    posts.forEach(post => {
      post.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Filter by following
      if (activeFilter === 'following') {
        if (!followingList.includes(post.user_id)) {
          return false;
        }
      }
      // Filter by type (skip for 'all' and 'following')
      else if (activeFilter !== 'all' && post.post_type !== activeFilter) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesContent = post.content.toLowerCase().includes(searchLower);
        const matchesTitle = post.title?.toLowerCase().includes(searchLower);
        const matchesTags = post.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesContent && !matchesTitle && !matchesTags) {
          return false;
        }
      }

      // Filter by active tags
      if (activeTags.length > 0) {
        const hasActiveTag = activeTags.some(activeTag => 
          post.tags?.includes(activeTag)
        );
        if (!hasActiveTag) {
          return false;
        }
      }

      return true;
    });
  }, [posts, activeFilter, searchQuery, activeTags, followingList]);

  const handleTagToggle = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-8">
        {error instanceof Error ? error.message : "Failed to load community posts."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stories Bar */}
      <StoriesBar />

      {/* Filters */}
      <CommunityFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTags={activeTags}
        onTagToggle={handleTagToggle}
        popularTags={popularTags}
        showFollowingFilter={!!user}
      />

      {/* Post Creation Form */}
      <PostCreationForm />

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <EnhancedPostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center text-muted-foreground py-16 bg-card/50 rounded-xl border border-border/50">
            <p className="text-lg mb-2">No posts found</p>
            <p className="text-sm">
              {activeFilter !== 'all' || searchQuery || activeTags.length > 0
                ? "Try adjusting your filters to see more posts."
                : "Be the first to start the conversation!"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
