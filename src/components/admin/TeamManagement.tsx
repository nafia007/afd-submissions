import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserMinus, Shield, Film, Code, Handshake } from "lucide-react";
import { toast } from "sonner";

interface Team {
  id: string;
  team_type: string;
  name: string;
  tagline: string;
}

interface TeamMembership {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  teams?: Team;
  profiles?: {
    id: string;
  };
}

interface MemberWithEmail {
  membership: TeamMembership;
  email: string;
}

const getTeamIcon = (teamType: string) => {
  switch (teamType) {
    case 'creator_circle':
      return <Film className="h-4 w-4" />;
    case 'tech_builders':
      return <Code className="h-4 w-4" />;
    case 'bridge_builders':
      return <Handshake className="h-4 w-4" />;
    case 'stewards':
      return <Shield className="h-4 w-4" />;
    default:
      return <Users className="h-4 w-4" />;
  }
};

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'lead':
      return 'default';
    case 'core_member':
      return 'secondary';
    case 'contributor':
      return 'outline';
    default:
      return 'outline';
  }
};

export const TeamManagement = () => {
  const queryClient = useQueryClient();
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  // Fetch teams
  const { data: teams, isLoading: teamsLoading } = useQuery({
    queryKey: ['admin-teams'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Team[];
    },
  });

  // Fetch all memberships with user info
  const { data: memberships, isLoading: membershipsLoading } = useQuery({
    queryKey: ['admin-team-memberships', selectedTeam],
    queryFn: async () => {
      let query = supabase
        .from('team_memberships')
        .select(`
          *,
          teams (id, team_type, name, tagline)
        `)
        .order('joined_at', { ascending: false });
      
      if (selectedTeam) {
        query = query.eq('team_id', selectedTeam);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as TeamMembership[];
    },
  });

  // Fetch user emails using admin RPC
  const { data: userEmails } = useQuery({
    queryKey: ['admin-user-emails'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_profiles_for_admin');
      if (error) throw error;
      
      const emailMap: Record<string, string> = {};
      data.forEach((user: { id: string; email: string }) => {
        emailMap[user.id] = user.email;
      });
      return emailMap;
    },
  });

  // Update member role mutation
  const updateRole = useMutation({
    mutationFn: async ({ membershipId, newRole }: { membershipId: string; newRole: 'lead' | 'core_member' | 'contributor' | 'observer' }) => {
      const { error } = await supabase
        .from('team_memberships')
        .update({ role: newRole })
        .eq('id', membershipId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team-memberships'] });
      toast.success('Member role updated');
    },
    onError: (error) => {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    },
  });

  // Remove member mutation
  const removeMember = useMutation({
    mutationFn: async (membershipId: string) => {
      const { error } = await supabase
        .from('team_memberships')
        .delete()
        .eq('id', membershipId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team-memberships'] });
      toast.success('Member removed from team');
    },
    onError: (error) => {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    },
  });

  // Get member counts per team
  const getMemberCount = (teamId: string) => {
    return memberships?.filter(m => m.team_id === teamId).length || 0;
  };

  // Get members with emails
  const getMembersWithEmails = (): MemberWithEmail[] => {
    if (!memberships || !userEmails) return [];
    
    return memberships.map(membership => ({
      membership,
      email: userEmails[membership.user_id] || 'Unknown',
    }));
  };

  if (teamsLoading) {
    return <div className="text-center py-8">Loading teams...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Team Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teams?.map((team) => (
          <Card 
            key={team.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTeam === team.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedTeam(selectedTeam === team.id ? null : team.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                {getTeamIcon(team.team_type)}
                {team.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{getMemberCount(team.id)}</p>
              <p className="text-xs text-muted-foreground">members</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter info */}
      {selectedTeam && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            Filtered by: {teams?.find(t => t.id === selectedTeam)?.name}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedTeam(null)}
          >
            Clear filter
          </Button>
        </div>
      )}

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
            {selectedTeam && (
              <Badge variant="outline" className="ml-2">
                {teams?.find(t => t.id === selectedTeam)?.name}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {membershipsLoading ? (
            <div className="text-center py-8">Loading members...</div>
          ) : !memberships || memberships.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No team members found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getMembersWithEmails().map(({ membership, email }) => (
                  <TableRow key={membership.id}>
                    <TableCell className="font-medium">{email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {membership.teams && getTeamIcon(membership.teams.team_type)}
                        {membership.teams?.name || 'Unknown'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={membership.role}
                        onValueChange={(value: 'lead' | 'core_member' | 'contributor' | 'observer') => updateRole.mutate({ 
                          membershipId: membership.id, 
                          newRole: value 
                        })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue>
                            <Badge variant={getRoleBadgeVariant(membership.role)}>
                              {membership.role}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lead">
                            <Badge variant="default">lead</Badge>
                          </SelectItem>
                          <SelectItem value="core_member">
                            <Badge variant="secondary">core_member</Badge>
                          </SelectItem>
                          <SelectItem value="contributor">
                            <Badge variant="outline">contributor</Badge>
                          </SelectItem>
                          <SelectItem value="observer">
                            <Badge variant="outline">observer</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(membership.joined_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeMember.mutate(membership.id)}
                        disabled={removeMember.isPending}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
