
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import CreatorAnalytics from "@/components/dashboard/CreatorAnalytics";
import InvestmentPortfolio from "@/components/dashboard/InvestmentPortfolio";

const CreatorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          return;
        }
        
        if (!sessionData.session) {
          console.log("No session found");
          setLoading(false);
          return;
        }
        
        const userId = sessionData.session.user.id;
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
        }
        
        setUserProfile({
          id: userId,
          email: sessionData.session.user.email,
          role: profileData?.role || 'user'
        });
        
      } catch (error: any) {
        console.error("Error in dashboard data fetch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 font-heading">Creator Dashboard</h1>
          <p className="text-muted-foreground">
            Track your film submissions, earnings, and investment portfolio
          </p>
        </div>

        {!userProfile && (
          <Alert variant="destructive">
            <AlertDescription>
              You need to be logged in to view this page. Please <a href="/login" className="underline">login</a> to continue.
            </AlertDescription>
          </Alert>
        )}

        {userProfile && (
          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="analytics">Creator Analytics</TabsTrigger>
              <TabsTrigger value="portfolio">Investment Portfolio</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics">
              <CreatorAnalytics userId={userProfile.id} />
            </TabsContent>
            
            <TabsContent value="portfolio">
              <InvestmentPortfolio />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;
