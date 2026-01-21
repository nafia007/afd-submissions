import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, Upload, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface BrandAd {
  id: string;
  title: string;
  image_url: string;
  link_url?: string;
  description?: string;
  active: boolean;
  position: number;
  created_at: string;
  updated_at: string;
}

interface NewBrandAd {
  title: string;
  image_url: string;
  link_url?: string;
  description?: string;
  active: boolean;
  position: number;
}

export function BrandAdsManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAd, setNewAd] = useState<NewBrandAd>({
    title: '',
    image_url: '',
    link_url: '',
    description: '',
    active: true,
    position: 0,
  });
  const [editingAd, setEditingAd] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all brand ads
  const { data: ads = [], isLoading } = useQuery<BrandAd[]>({
    queryKey: ['admin-brand-ads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brand_ads')
        .select('*')
        .order('position', { ascending: true });
      if (error) throw error;
      return data as BrandAd[];
    },
  });

  // Create brand ad mutation
  const { mutate: createAd, isPending: creating } = useMutation({
    mutationFn: async (data: NewBrandAd) => {
      const { error } = await supabase.from("brand_ads").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      setNewAd({
        title: '',
        image_url: '',
        link_url: '',
        description: '',
        active: true,
        position: 0,
      });
      setShowCreateForm(false);
      queryClient.invalidateQueries({ queryKey: ['admin-brand-ads'] });
      queryClient.invalidateQueries({ queryKey: ['brand-ads'] });
      toast.success("Brand ad created successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Could not create brand ad.");
    },
  });

  // Update brand ad mutation
  const { mutate: updateAd } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BrandAd> }) => {
      const { error } = await supabase
        .from('brand_ads')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      setEditingAd(null);
      queryClient.invalidateQueries({ queryKey: ['admin-brand-ads'] });
      queryClient.invalidateQueries({ queryKey: ['brand-ads'] });
      toast.success("Brand ad updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Could not update brand ad.");
    },
  });

  // Delete brand ad mutation
  const { mutate: deleteAd } = useMutation({
    mutationFn: async (adId: string) => {
      const { error } = await supabase
        .from('brand_ads')
        .delete()
        .eq('id', adId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-brand-ads'] });
      queryClient.invalidateQueries({ queryKey: ['brand-ads'] });
      toast.success("Brand ad deleted successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Could not delete brand ad.");
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `brand-ads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('brand-ads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('brand-ads')
        .getPublicUrl(filePath);

      setNewAd(prev => ({ ...prev, image_url: data.publicUrl }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAd.title.trim() || !newAd.image_url.trim()) return;
    createAd(newAd);
  };

  const toggleAdActive = (ad: BrandAd) => {
    updateAd({ id: ad.id, data: { active: !ad.active } });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Brand Ads Management</h3>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Ad
        </Button>
      </div>

      {/* Create Ad Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Brand Ad</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Ad title..."
                  value={newAd.title}
                  onChange={(e) => setNewAd(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">Image *</Label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {newAd.image_url && (
                    <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                      <img
                        src={newAd.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="link_url">Link URL</Label>
                <Input
                  id="link_url"
                  placeholder="https://example.com"
                  value={newAd.link_url}
                  onChange={(e) => setNewAd(prev => ({ ...prev, link_url: e.target.value }))}
                  type="url"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Ad description..."
                  value={newAd.description}
                  onChange={(e) => setNewAd(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  type="number"
                  placeholder="0"
                  value={newAd.position}
                  onChange={(e) => setNewAd(prev => ({ ...prev, position: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={newAd.active}
                  onCheckedChange={(checked) => setNewAd(prev => ({ ...prev, active: checked }))}
                />
                <Label htmlFor="active">Active</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={creating || uploading || !newAd.title.trim() || !newAd.image_url.trim()}
                >
                  {creating ? "Creating..." : "Create Ad"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Ads List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading ads...</div>
        ) : ads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No brand ads found</div>
        ) : (
          ads.map((ad) => (
            <Card key={ad.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{ad.title}</h4>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={ad.active}
                          onCheckedChange={() => toggleAdActive(ad)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAd(ad.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {ad.description && (
                      <p className="text-sm text-muted-foreground">{ad.description}</p>
                    )}

                    {ad.link_url && (
                      <a
                        href={ad.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {ad.link_url}
                      </a>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Position: {ad.position}</span>
                      <span>Status: {ad.active ? 'Active' : 'Inactive'}</span>
                      <span>Created: {new Date(ad.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}