import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { toast } from "sonner";

export function useFollow(targetUserId?: string) {
  const { user } = useAuthState();
  const queryClient = useQueryClient();

  // Check if current user follows the target user
  const { data: isFollowing = false, isLoading: isCheckingFollow } = useQuery({
    queryKey: ['follow-status', user?.id, targetUserId],
    queryFn: async () => {
      if (!user?.id || !targetUserId) return false;
      
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user?.id && !!targetUserId,
  });

  // Get list of users the current user follows
  const { data: followingList = [] } = useQuery({
    queryKey: ['following-list', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (error) throw error;
      return data.map(f => f.following_id);
    },
    enabled: !!user?.id,
  });

  // Get follower count for a user
  const { data: followerCount = 0 } = useQuery({
    queryKey: ['follower-count', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return 0;
      
      const { count, error } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', targetUserId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!targetUserId,
  });

  // Get following count for a user
  const { data: followingCount = 0 } = useQuery({
    queryKey: ['following-count', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return 0;
      
      const { count, error } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', targetUserId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!targetUserId,
  });

  const followMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!user?.id) throw new Error("Must be logged in");
      
      const { error } = await supabase
        .from('follows')
        .insert({ follower_id: user.id, following_id: userId });

      if (error) throw error;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['follow-status', user?.id, userId] });
      queryClient.invalidateQueries({ queryKey: ['following-list', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['follower-count', userId] });
      toast.success("Following!");
    },
    onError: (error) => {
      toast.error("Failed to follow: " + error.message);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!user?.id) throw new Error("Must be logged in");
      
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      if (error) throw error;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['follow-status', user?.id, userId] });
      queryClient.invalidateQueries({ queryKey: ['following-list', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['follower-count', userId] });
      toast.success("Unfollowed");
    },
    onError: (error) => {
      toast.error("Failed to unfollow: " + error.message);
    },
  });

  const toggleFollow = (userId: string) => {
    if (!user) {
      toast.error("Please log in to follow users");
      return;
    }
    
    // Check current state for this specific user
    supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          unfollowMutation.mutate(userId);
        } else {
          followMutation.mutate(userId);
        }
      });
  };

  return {
    isFollowing,
    isCheckingFollow,
    followingList,
    followerCount,
    followingCount,
    toggleFollow,
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
    isLoading: followMutation.isPending || unfollowMutation.isPending,
  };
}
