
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Building, TrendingUp, DollarSign } from "lucide-react";
import AssetCreationForm from "@/components/asset-management/AssetCreationForm";
import AssetList from "@/components/asset-management/AssetList";
import AssetMetrics from "@/components/asset-management/AssetMetrics";
import AssetPortfolio from "@/components/asset-management/AssetPortfolio";

const AssetManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const { data: assets, isLoading, refetch } = useQuery({
    queryKey: ['rwa-assets'],
    queryFn: async () => {
      // For now, we'll use the existing films table as a placeholder
      // In production, this would be a dedicated RWA assets table
      const { data, error } = await supabase
        .from('films')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto px-4 pt-32 pb-16">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-heading text-4xl font-bold mb-4">Asset Management</h1>
            <p className="text-foreground/70 max-w-2xl">
              Manage your real-world asset tokenization portfolio. Create, monitor, and optimize your tokenized assets.
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Tokenize New Asset
          </Button>
        </div>

        {/* Asset Creation Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <AssetCreationForm 
                onClose={() => setShowCreateForm(false)}
                onSuccess={() => {
                  setShowCreateForm(false);
                  refetch();
                }}
              />
            </div>
          </div>
        )}

        {/* Key Metrics Overview */}
        <AssetMetrics assets={assets || []} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="portfolio" className="gap-2">
              <Building className="w-4 h-4" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="assets" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              All Assets
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <DollarSign className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio">
            <AssetPortfolio assets={assets || []} />
          </TabsContent>

          <TabsContent value="assets">
            <AssetList 
              assets={assets || []} 
              isLoading={isLoading}
              onRefetch={refetch}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    Advanced analytics dashboard coming soon...
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AssetManagement;
