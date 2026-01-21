import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import CommunityPosts from "@/components/community/CommunityPosts";
import { TrendingPosts } from "@/components/community/TrendingPosts";
import { UserEngagementStats } from "@/components/community/UserEngagementStats";
import { SuggestedUsers } from "@/components/community/SuggestedUsers";
import { BrandAdsSidebar } from "@/components/community/BrandAdsSidebar";
import { MessageButton } from "@/components/community/MessageButton";
import { TeamsSection } from "@/components/community/TeamsSection";
import communityCta from "@/assets/community-cta.png";

const Community = () => {
  const { user, loading } = useAuth();
  
  console.log("Community page - user:", user, "loading:", loading);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading community..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Banner */}
      <div className="relative w-full overflow-hidden">
        <img 
          src={communityCta} 
          alt="Community: Shape the Future - Your voice matters, Your vote counts" 
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-10 pb-12">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            AFD Community
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect with filmmakers, discover opportunities, and showcase your work
          </p>
          
          {/* Floating Message Button */}
          <div className="fixed bottom-6 right-6 z-40 lg:absolute lg:top-0 lg:right-0 lg:bottom-auto">
            <MessageButton />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="sticky top-24 space-y-6">
              <UserEngagementStats />
              <SuggestedUsers />
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6 space-y-6">
            <TeamsSection />
            <CommunityPosts />
          </div>

          {/* Right Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="sticky top-24 space-y-6">
              <TrendingPosts />
              <BrandAdsSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
