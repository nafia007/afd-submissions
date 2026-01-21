import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { useFollow } from "@/hooks/useFollow";
import { useAuthState } from "@/hooks/useAuthState";

interface FollowButtonProps {
  userId: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
  showText?: boolean;
  className?: string;
}

export function FollowButton({ 
  userId, 
  variant = "outline", 
  size = "sm",
  showText = true,
  className = ""
}: FollowButtonProps) {
  const { user } = useAuthState();
  const { isFollowing, isCheckingFollow, toggleFollow, isLoading } = useFollow(userId);

  // Don't show button for own profile
  if (user?.id === userId) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFollow(userId);
  };

  if (isCheckingFollow) {
    return (
      <Button variant={variant} size={size} disabled className={className}>
        <Loader2 className="w-3 h-3 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      variant={isFollowing ? "secondary" : variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={`gap-1 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="w-3 h-3" />
          {showText && "Following"}
        </>
      ) : (
        <>
          <UserPlus className="w-3 h-3" />
          {showText && "Follow"}
        </>
      )}
    </Button>
  );
}
