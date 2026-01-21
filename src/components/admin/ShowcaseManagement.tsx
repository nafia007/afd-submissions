import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface FilmmakerProfile {
  id: string;
  name: string | null;
  email?: string | null;
  bio: string | null;
  role: string | null;
  experience: string | null;
  skills: string[] | null;
  profile_image_url: string | null;
  portfolio_url: string | null;
  website_url: string | null;
  show_in_showcase: boolean;
  created_at: string;
  updated_at: string;
}

export function ShowcaseManagement() {
  const [updating, setUpdating] = useState<string | null>(null);

  // Fetch all filmmaker profiles with extended data and auth info
  const { data: profiles, isLoading, refetch } = useQuery({
    queryKey: ['admin-filmmaker-profiles'],
    queryFn: async () => {
      // Get filmmaker profiles
      const { data: basicProfiles, error: basicError } = await supabase
        .from('filmmaker_profiles')
        .select('*')
        .order('updated_at', { ascending: false });

      if (basicError) throw basicError;

      // Get extended profiles
      const { data: extendedProfiles, error: extendedError } = await supabase
        .from('filmmaker_profiles_extended')
        .select('*');

      if (extendedError) throw extendedError;

      // Get auth user data to get emails for display
      const { data: authUsers, error: authError } = await supabase
        .rpc('get_user_profiles_for_admin');

      if (authError) console.warn('Could not fetch user emails:', authError);

      // Join the data manually
      const joinedProfiles = basicProfiles?.map(profile => {
        const extended = extendedProfiles?.find(ext => ext.id === profile.id);
        const authUser = authUsers?.find(user => user.id === profile.id);
        
        // Use email if name is generic "Film Enthusiast"
        const displayName = extended?.name === 'Film Enthusiast' || !extended?.name 
          ? authUser?.email?.split('@')[0] || 'Unknown User'
          : extended?.name;

        return {
          ...profile,
          name: displayName,
          email: authUser?.email,
          role: extended?.role || 'Film Enthusiast',
          experience: extended?.experience || 'New to platform',
          skills: extended?.skills || [],
          profile_image_url: extended?.image ? 
            `https://hoylwkrhbyoknjcmxigu.supabase.co/storage/v1/object/public/profile-images/${extended.image}` : 
            null
        };
      }) || [];

      return joinedProfiles as FilmmakerProfile[];
    }
  });

  const handleToggleShowcase = async (profileId: string, currentStatus: boolean) => {
    setUpdating(profileId);
    try {
      console.log('Attempting to update showcase status:', {
        profileId,
        currentStatus,
        newStatus: !currentStatus
      });

      const { error } = await supabase
        .from('filmmaker_profiles')
        .update({ show_in_showcase: !currentStatus })
        .eq('id', profileId);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Successfully updated showcase status');
      toast.success(`Filmmaker ${!currentStatus ? 'added to' : 'removed from'} showcase`);
      refetch();
    } catch (error) {
      console.error('Error updating showcase status:', error);
      toast.error(`Failed to update showcase status: ${error.message || 'Unknown error'}`);
    } finally {
      setUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading filmmaker profiles...</p>
      </div>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No filmmaker profiles found
      </div>
    );
  }

  const showcasedProfiles = profiles.filter(p => p.show_in_showcase);
  const availableProfiles = profiles.filter(p => !p.show_in_showcase);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Currently Showcased ({showcasedProfiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {showcasedProfiles.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No filmmakers currently showcased
                </p>
              ) : (
                showcasedProfiles.map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={profile.profile_image_url || ""} />
                        <AvatarFallback className="bg-accent/10 text-accent">
                          <User className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{profile.name}</p>
                        <p className="text-sm text-muted-foreground">{profile.role}</p>
                        {profile.email && (
                          <p className="text-xs text-muted-foreground">{profile.email}</p>
                        )}
                        {profile.skills && profile.skills.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {profile.skills.slice(0, 2).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {profile.skills.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{profile.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`showcase-${profile.id}`} className="sr-only">
                        Remove from showcase
                      </Label>
                      <Switch
                        id={`showcase-${profile.id}`}
                        checked={true}
                        onCheckedChange={() => handleToggleShowcase(profile.id, true)}
                        disabled={updating === profile.id}
                      />
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <EyeOff className="w-5 h-5" />
              Available to Showcase ({availableProfiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableProfiles.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  All profiles are currently showcased
                </p>
              ) : (
                availableProfiles.map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={profile.profile_image_url || ""} />
                        <AvatarFallback className="bg-accent/10 text-accent">
                          <User className="w-6 h-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{profile.name}</p>
                        <p className="text-sm text-muted-foreground">{profile.role}</p>
                        {profile.email && (
                          <p className="text-xs text-muted-foreground">{profile.email}</p>
                        )}
                        {profile.skills && profile.skills.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {profile.skills.slice(0, 2).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {profile.skills.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{profile.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`showcase-available-${profile.id}`} className="sr-only">
                        Add to showcase
                      </Label>
                      <Switch
                        id={`showcase-available-${profile.id}`}
                        checked={false}
                        onCheckedChange={() => handleToggleShowcase(profile.id, false)}
                        disabled={updating === profile.id}
                      />
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}