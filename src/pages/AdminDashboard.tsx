import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { FileText, Users, Upload, BarChart3, Film, TrendingUp, UsersRound } from "lucide-react";
import { AdminMetrics } from "@/components/admin/AdminMetrics";
import { SubmissionReviewCard } from "@/components/admin/SubmissionReviewCard";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { ShowcaseManagement } from "@/components/admin/ShowcaseManagement";
import { PostManagement } from "@/components/admin/PostManagement";
import { BrandAdsManagement } from "@/components/admin/BrandAdsManagement";
import { FilmManagement } from "@/components/admin/FilmManagement";
import { AdvancedAnalytics } from "@/components/admin/AdvancedAnalytics";
import { ActivityLog } from "@/components/admin/ActivityLog";
import { AdminUserMessaging } from "@/components/admin/AdminUserMessaging";
import { TeamManagement } from "@/components/admin/TeamManagement";

interface UserProfile {
  id: string;
  role: 'admin' | 'user';
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

interface AFDSubmission {
  id: string;
  title: string;
  director: string;
  genre: string;
  country_of_origin: string;
  country_of_production: string;
  format: string;
  budget: string;
  partners: string;
  tier: string;
  file_type: string;
  file_url: string;
  description: string;
  created_at: string;
  user_id: string;
  approval_status?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  admin_notes?: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();

  // Check if user is admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
      toast.error("Access denied. Admin only.");
    }
  }, [isAdmin, loading, navigate]);

  // Fetch user profiles using the database function
  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ['admin-user-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_profiles_for_admin');
      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: isAdmin && !loading
  });

  // Fetch AFD submissions
  const { data: submissions, isLoading: submissionsLoading, refetch: refetchSubmissions } = useQuery({
    queryKey: ['admin-afd-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('afd_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AFDSubmission[];
    },
    enabled: isAdmin && !loading
  });

  // Fetch community posts for analytics
  const { data: posts } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin && !loading
  });

  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    try {
      // Extract the file path from the full URL
      const urlParts = fileUrl.split('/storage/v1/object/public/afd-uploads/');
      if (urlParts.length !== 2) {
        throw new Error('Invalid file URL format');
      }
      
      const filePath = urlParts[1];
      
      // Get signed URL for download
      const { data, error } = await supabase.storage
        .from('afd-uploads')
        .createSignedUrl(filePath, 3600); // 1 hour expiry
      
      if (error) throw error;
      
      // Create download link
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = fileName || 'download';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handleViewFile = async (fileUrl: string, title: string) => {
    try {
      // Extract the file path from the full URL
      const urlParts = fileUrl.split('/storage/v1/object/public/afd-uploads/');
      if (urlParts.length !== 2) {
        throw new Error('Invalid file URL format');
      }
      
      const filePath = urlParts[1];
      
      // Get signed URL for viewing
      const { data, error } = await supabase.storage
        .from('afd-uploads')
        .createSignedUrl(filePath, 3600); // 1 hour expiry
      
      if (error) throw error;
      
      // Open in new tab
      window.open(data.signedUrl, '_blank');
      toast.success('File opened in new tab');
    } catch (error) {
      console.error('View error:', error);
      toast.error('Failed to open file');
    }
  };

  if (loading || !isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-heading text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-foreground/70 max-w-2xl">
            Manage users and African Film DAO submissions across the platform.
          </p>
        </div>

        <AdminMetrics users={users || []} submissions={submissions || []} />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="films" className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              Films
            </TabsTrigger>
            <TabsTrigger value="submissions" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Submissions
            </TabsTrigger>
            <TabsTrigger value="showcase" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Showcase
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="ads" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Brand Ads
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <UsersRound className="w-4 h-4" />
              Teams
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Recent Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {submissions?.slice(0, 5).map((submission) => (
                      <div key={submission.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{submission.title}</p>
                          <p className="text-sm text-muted-foreground">by {submission.director}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {submission.approval_status === 'approved' && (
                            <span className="text-green-500 text-sm">✓ Approved</span>
                          )}
                          {submission.approval_status === 'rejected' && (
                            <span className="text-red-500 text-sm">✗ Rejected</span>
                          )}
                          {submission.approval_status === 'pending' && (
                            <span className="text-muted-foreground text-sm">⏳ Pending</span>
                          )}
                        </div>
                      </div>
                    )) || <p className="text-muted-foreground">No submissions yet</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Recent Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users?.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{user.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-sm px-2 py-1 rounded ${
                          user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    )) || <p className="text-muted-foreground">No users yet</p>}
                  </div>
                </CardContent>
              </Card>
                </div>
              </div>
              <ActivityLog />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AdvancedAnalytics users={users || []} submissions={submissions || []} posts={posts || []} />
          </TabsContent>

          <TabsContent value="films" className="space-y-6">
            <FilmManagement />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Management
                  </CardTitle>
                  <AdminUserMessaging users={users || []} />
                </div>
              </CardHeader>
              <CardContent>
                <UserManagementTable 
                  users={users || []} 
                  isLoading={usersLoading}
                  onUserUpdate={refetchUsers}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  AFD Submissions Review ({submissions?.length || 0} total)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {submissionsLoading ? (
                    <div className="text-center py-8">Loading submissions...</div>
                  ) : !submissions || submissions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No AFD submissions found</div>
                  ) : submissions?.map((submission) => (
                    <SubmissionReviewCard
                      key={submission.id}
                      submission={submission}
                      onStatusUpdate={refetchSubmissions}
                      onDownload={handleDownloadFile}
                      onView={handleViewFile}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="showcase" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Filmmaker Showcase Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ShowcaseManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Community Posts Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PostManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Brand Ads Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BrandAdsManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UsersRound className="w-5 h-5" />
                  Team Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TeamManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;