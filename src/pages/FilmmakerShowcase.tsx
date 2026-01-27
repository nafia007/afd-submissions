import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, ExternalLink, Globe, Briefcase, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { toast } from "sonner";

interface ShowcaseProfile {
  id: string;
  bio: string | null;
  portfolio_url: string | null;
  website_url: string | null;
  skills: string[] | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
  name: string | null;
  role: string | null;
  experience: string | null;
}

const FilmmakerShowcase = () => {
  const [profiles, setProfiles] = useState<ShowcaseProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShowcaseProfiles();
  }, []);

  const fetchShowcaseProfiles = async () => {
    try {
      // Fetch profiles from filmmaker_profiles where show_in_showcase is true
      const { data: profilesData, error: profilesError } = await supabase
        .from('filmmaker_profiles')
        .select('*')
        .eq('show_in_showcase', true)
        .order('updated_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch extended profiles data
      const { data: extendedData, error: extendedError } = await supabase
        .from('filmmaker_profiles_extended')
        .select('*');

      if (extendedError) throw extendedError;

      // Create a map of extended profiles by id for quick lookup
      const extendedProfilesMap = new Map(
        (extendedData || []).map(profile => [profile.id, profile])
      );

      // Transform the data to match our interface
      const transformedData = (profilesData || []).map(profile => ({
        id: profile.id || '',
        bio: profile.bio,
        portfolio_url: profile.portfolio_url,
        website_url: profile.website_url,
        skills: profile.skills as string[] | null,
        profile_image_url: profile.profile_image_url,
        created_at: profile.created_at || '',
        updated_at: profile.updated_at || '',
        name: extendedProfilesMap.get(profile.id)?.name || null,
        role: extendedProfilesMap.get(profile.id)?.role || null,
        experience: extendedProfilesMap.get(profile.id)?.experience || null
      }));
      
      setProfiles(transformedData);
    } catch (error: any) {
      console.error('Error fetching showcase profiles:', error);
      toast.error('Failed to load filmmaker showcase');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading filmmaker showcase..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Filmmaker Showcase</h1>
            <p className="text-lg md:text-xl text-muted-foreground px-4">
              Discover talented filmmakers in our community
            </p>
          </div>

          {profiles.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">No filmmakers in showcase yet</h3>
                <p className="text-muted-foreground">
                  Be the first to showcase your profile to the community!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {profiles.map((profile) => (
                <Card key={profile.id} className="h-full">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={profile.profile_image_url || ""} />
                        <AvatarFallback className="bg-accent/10 text-accent">
                          <User className="w-8 h-8" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle className="text-lg">
                      {profile.name || "Filmmaker"}
                    </CardTitle>
                    {profile.role && (
                      <Badge variant="outline" className="w-fit mx-auto">
                        {profile.role}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {profile.bio}
                      </p>
                    )}

                    {profile.experience && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Experience
                        </label>
                        <p className="text-sm mt-1">{profile.experience}</p>
                      </div>
                    )}

                    {profile.skills && profile.skills.length > 0 && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Skills
                        </label>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {profile.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {profile.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{profile.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      {profile.portfolio_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                          asChild
                        >
                          <a
                            href={profile.portfolio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Briefcase className="w-3 h-3" />
                            Portfolio
                          </a>
                        </Button>
                      )}
                      {profile.website_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2"
                          asChild
                        >
                          <a
                            href={profile.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Globe className="w-3 h-3" />
                            Website
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilmmakerShowcase;