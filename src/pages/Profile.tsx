
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Edit, FileText, Calendar, ExternalLink, BarChart3, ArrowDownUp, Star } from "lucide-react";
import ProfileInfo from "@/components/profile/ProfileInfo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ProfileForm from "@/components/profile/ProfileForm";

interface UserProfile {
  id: string;
  bio: string | null;
  portfolio_url: string | null;
  website_url: string | null;
  skills: string[] | null;
  profile_image_url: string | null;
  show_in_showcase: boolean | null;
}

interface AFDSubmission {
  id: string;
  title: string;
  description: string | null;
  director: string | null;
  tier: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

const TIER_LABELS: Record<string, string> = {
  development: "Development",
  finished_script: "Finished Script",
  post_production: "Post-production",
  complete_seeking_distribution: "Complete and seeking distribution",
};

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [afdSubmissions, setAfdSubmissions] = useState<AFDSubmission[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  console.log("Profile page - user:", user, "authLoading:", authLoading);

  useEffect(() => {
    if (!authLoading && !user) {
      console.log("No user found, redirecting to login");
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && !authLoading) {
      fetchUserProfile();
      fetchAfdSubmissions();
    }
  }, [user, authLoading]);

  const fetchUserProfile = async () => {
    if (!user) return;

    setLoadingProfile(true);
    try {
      console.log("Fetching profile for user:", user.id);
      const { data, error } = await supabase
        .from('filmmaker_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
        return;
      }

      console.log("Profile data:", data);
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchAfdSubmissions = async () => {
    if (!user) return;

    setLoadingSubmissions(true);
    try {
      const { data, error } = await supabase
        .from('afd_submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching AFD submissions:', error);
        toast.error('Failed to load submissions');
        return;
      }

      setAfdSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching AFD submissions:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  if (authLoading || (loadingProfile && loadingSubmissions)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Profile</h1>
            {userProfile?.show_in_showcase && (
              <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full">
                <Star className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">In Showcase</span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ProfileInfo 
                email={user.email}
                bio={userProfile?.bio}
                profileImageUrl={userProfile?.profile_image_url}
              />
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Filmmaker Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <p className="text-foreground">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Display Name</label>
                    <p className="text-foreground">
                      {user.user_metadata?.name || user.email?.split('@')[0] || "User"}
                    </p>
                  </div>
                  {userProfile && (
                    <>
                      {userProfile.bio && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Bio</label>
                          <p className="text-foreground">{userProfile.bio}</p>
                        </div>
                      )}
                      {userProfile.portfolio_url && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Portfolio</label>
                          <a 
                            href={userProfile.portfolio_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-accent hover:underline"
                          >
                            {userProfile.portfolio_url}
                          </a>
                        </div>
                      )}
                      {userProfile.website_url && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Website</label>
                          <a 
                            href={userProfile.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-accent hover:underline"
                          >
                            {userProfile.website_url}
                          </a>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {!userProfile && (
                <ProfileForm 
                  userId={user.id}
                  filmmakerProfile={userProfile}
                  setFilmmakerProfile={setUserProfile}
                  initialBio=""
                  initialPortfolioUrl=""
                  initialWebsiteUrl=""
                />
              )}

              {userProfile && (
                <ProfileForm 
                  userId={user.id}
                  filmmakerProfile={userProfile}
                  setFilmmakerProfile={setUserProfile}
                  initialBio={userProfile.bio || ""}
                  initialPortfolioUrl={userProfile.portfolio_url || ""}
                  initialWebsiteUrl={userProfile.website_url || ""}
                />
              )}
            </div>
          </div>

          {/* AFD Submissions Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                AFD Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSubmissions ? (
                <div className="flex items-center justify-center p-6">
                  <LoadingSpinner size="sm" text="Loading submissions..." />
                </div>
              ) : afdSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {afdSubmissions.map((submission) => (
                    <div key={submission.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{submission.title}</h3>
                          {submission.director && (
                            <p className="text-muted-foreground text-sm">
                              Director: {submission.director}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline">
                          {TIER_LABELS[submission.tier] || submission.tier}
                        </Badge>
                      </div>
                      
                      {submission.description && (
                        <p className="text-foreground text-sm">{submission.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-muted-foreground text-xs">
                          <Calendar className="w-3 h-3" />
                          {new Date(submission.created_at).toLocaleDateString()}
                        </div>
                        <a
                          href={submission.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-accent hover:underline text-sm"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {submission.tier === "development" || submission.tier === "finished_script" ? "View Script" : "View Video"}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No AFD submissions yet.</p>
                  <p className="text-sm mt-2">Your submitted proposals will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assets Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                My Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Total Asset Value</h4>
                    <p className="text-muted-foreground text-sm">Across all holdings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl">$0</p>
                    <p className="text-sm text-muted-foreground">No assets yet</p>
                  </div>
                </div>
                <Link to="/assets">
                  <Button variant="outline" className="w-full">
                    View Asset Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Exchange Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDownUp className="w-5 h-5" />
                Trading & Exchange
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <h4 className="font-medium">Total Trades</h4>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <h4 className="font-medium">Trading Volume</h4>
                    <p className="text-2xl font-bold">$0</p>
                  </div>
                </div>
                <Link to="/dex">
                  <Button variant="outline" className="w-full">
                    Access Exchange
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
