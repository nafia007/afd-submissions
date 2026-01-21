import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Film, Code, Handshake, Shield, ChevronDown, Users, LogIn, LogOut, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Team {
  id: string;
  team_type: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  responsibilities: string[];
}

interface TeamMembership {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

const getTeamIcon = (iconName: string) => {
  switch (iconName) {
    case 'film':
      return <Film className="h-6 w-6" />;
    case 'code':
      return <Code className="h-6 w-6" />;
    case 'handshake':
      return <Handshake className="h-6 w-6" />;
    case 'shield':
      return <Shield className="h-6 w-6" />;
    default:
      return <Users className="h-6 w-6" />;
  }
};

const getTeamGradient = (teamType: string) => {
  switch (teamType) {
    case 'creator_circle':
      return 'from-amber-500/20 to-orange-500/20 border-amber-500/30';
    case 'tech_builders':
      return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
    case 'bridge_builders':
      return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
    case 'stewards':
      return 'from-purple-500/20 to-violet-500/20 border-purple-500/30';
    default:
      return 'from-primary/20 to-accent/20 border-primary/30';
  }
};

const getTeamIconColor = (teamType: string) => {
  switch (teamType) {
    case 'creator_circle':
      return 'text-amber-500';
    case 'tech_builders':
      return 'text-blue-500';
    case 'bridge_builders':
      return 'text-green-500';
    case 'stewards':
      return 'text-purple-500';
    default:
      return 'text-primary';
  }
};

export const TeamsSection = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

  // Fetch teams
  const { data: teams, isLoading: teamsLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Team[];
    },
  });

  // Fetch user's team memberships
  const { data: memberships } = useQuery({
    queryKey: ['team-memberships', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('team_memberships')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as TeamMembership[];
    },
    enabled: !!user,
  });

  // Fetch member counts for each team
  const { data: memberCounts } = useQuery({
    queryKey: ['team-member-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_memberships')
        .select('team_id');
      
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data.forEach((m) => {
        counts[m.team_id] = (counts[m.team_id] || 0) + 1;
      });
      return counts;
    },
  });

  // Join team mutation
  const joinTeam = useMutation({
    mutationFn: async (teamId: string) => {
      if (!user) throw new Error('Must be logged in');
      
      const { error } = await supabase
        .from('team_memberships')
        .insert({
          team_id: teamId,
          user_id: user.id,
          role: 'observer',
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-memberships'] });
      queryClient.invalidateQueries({ queryKey: ['team-member-counts'] });
      toast.success('Welcome to the team!');
    },
    onError: (error) => {
      console.error('Error joining team:', error);
      toast.error('Failed to join team');
    },
  });

  // Leave team mutation
  const leaveTeam = useMutation({
    mutationFn: async (teamId: string) => {
      if (!user) throw new Error('Must be logged in');
      
      const { error } = await supabase
        .from('team_memberships')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-memberships'] });
      queryClient.invalidateQueries({ queryKey: ['team-member-counts'] });
      toast.success('You have left the team');
    },
    onError: (error) => {
      console.error('Error leaving team:', error);
      toast.error('Failed to leave team');
    },
  });

  const isUserInTeam = (teamId: string) => {
    return memberships?.some((m) => m.team_id === teamId);
  };

  const getUserRole = (teamId: string) => {
    return memberships?.find((m) => m.team_id === teamId)?.role;
  };

  if (teamsLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-xl">Teams Building the Future</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted/50 animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl md:text-2xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Teams Building the Future
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          We are organized into four core teams, each essential to our mission. These are not corporate departments, but dynamic circles where contributors unite around shared goals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams?.map((team) => (
            <Collapsible
              key={team.id}
              open={expandedTeam === team.id}
              onOpenChange={(open) => setExpandedTeam(open ? team.id : null)}
            >
              <Card className={`bg-gradient-to-br ${getTeamGradient(team.team_type)} border transition-all duration-300 hover:shadow-lg`}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-background/50 ${getTeamIconColor(team.team_type)}`}>
                          {getTeamIcon(team.icon)}
                        </div>
                        <div>
                          <CardTitle className="text-base md:text-lg flex items-center gap-2">
                            {team.name}
                            {isUserInTeam(team.id) && (
                              <Badge variant="secondary" className="text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {getUserRole(team.id)}
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-sm italic">
                            {team.tagline}
                          </CardDescription>
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${expandedTeam === team.id ? 'rotate-180' : ''}`} />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">What they do:</span> {team.description}
                    </p>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">Key Responsibilities:</p>
                      <ul className="space-y-1">
                        {team.responsibilities.map((resp, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{memberCounts?.[team.id] || 0} members</span>
                      </div>
                      
                      {user ? (
                        isUserInTeam(team.id) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => leaveTeam.mutate(team.id)}
                            disabled={leaveTeam.isPending}
                            className="gap-2"
                          >
                            <LogOut className="h-4 w-4" />
                            Leave Team
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => joinTeam.mutate(team.id)}
                            disabled={joinTeam.isPending}
                            className="gap-2"
                          >
                            <LogIn className="h-4 w-4" />
                            Join Team
                          </Button>
                        )
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info('Please log in to join a team')}
                          className="gap-2"
                        >
                          <LogIn className="h-4 w-4" />
                          Login to Join
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
