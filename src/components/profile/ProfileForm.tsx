
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import InputSanitizer from "@/components/auth/InputSanitizer";
import TextAreaSanitizer from "@/components/auth/TextAreaSanitizer";
import ImageUpload from "./ImageUpload";

interface FilmmakerProfile {
  id: string;
  bio: string | null;
  portfolio_url: string | null;
  website_url: string | null;
  skills: string[] | null;
  profile_image_url: string | null;
  show_in_showcase: boolean | null;
}

interface ProfileFormProps {
  userId: string;
  filmmakerProfile: FilmmakerProfile | null;
  setFilmmakerProfile: (profile: FilmmakerProfile | null) => void;
  initialBio: string;
  initialPortfolioUrl: string;
  initialWebsiteUrl: string;
}

const ProfileForm = ({ 
  userId,
  filmmakerProfile, 
  setFilmmakerProfile,
  initialBio,
  initialPortfolioUrl,
  initialWebsiteUrl
}: ProfileFormProps) => {
  const [bio, setBio] = useState<string>(initialBio);
  const [portfolioUrl, setPortfolioUrl] = useState<string>(initialPortfolioUrl);
  const [websiteUrl, setWebsiteUrl] = useState<string>(initialWebsiteUrl);
  const [showInShowcase, setShowInShowcase] = useState<boolean>(filmmakerProfile?.show_in_showcase || false);
  const [updating, setUpdating] = useState(false);

  const handleProfileUpdate = async () => {
    setUpdating(true);
    try {
      console.log("Attempting to update profile for user:", userId);
      console.log("Current filmmaker profile:", filmmakerProfile);
      
      if (filmmakerProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('filmmaker_profiles')
          .update({
            bio,
            portfolio_url: portfolioUrl,
            website_url: websiteUrl,
            show_in_showcase: showInShowcase
          })
          .eq('id', userId);
        
        if (error) {
          console.error("Error updating profile:", error);
          throw error;
        }
        
        // Update local state with new values
        setFilmmakerProfile({
          ...filmmakerProfile,
          bio,
          portfolio_url: portfolioUrl,
          website_url: websiteUrl,
          show_in_showcase: showInShowcase
        });
        
        console.log("Profile updated successfully");
      } else {
        // Create new profile
        console.log("Creating new filmmaker profile for user:", userId);
        const { data, error } = await supabase
          .from('filmmaker_profiles')
          .insert({
            id: userId,
            bio,
            portfolio_url: portfolioUrl,
            website_url: websiteUrl,
            show_in_showcase: showInShowcase
          })
          .select()
          .single();
        
        if (error) {
          console.error("Error creating profile:", error);
          throw error;
        }
        
        // Set the new profile in state
        setFilmmakerProfile(data as FilmmakerProfile);
        console.log("New profile created successfully:", data);
      }
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUploaded = (url: string) => {
    if (filmmakerProfile) {
      setFilmmakerProfile({
        ...filmmakerProfile,
        profile_image_url: url
      });
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Image Upload Section */}
      <div className="md:col-span-1">
        <ImageUpload
          userId={userId}
          currentImageUrl={filmmakerProfile?.profile_image_url}
          onImageUploaded={handleImageUploaded}
        />
      </div>

      {/* Profile Form Section */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your filmmaker profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <TextAreaSanitizer
              value={bio}
              onChange={setBio}
              placeholder="Tell us about yourself as a filmmaker"
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm resize-none"
              rows={4}
              maxLength={1000}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio URL</Label>
            <InputSanitizer
              type="url"
              value={portfolioUrl}
              onChange={setPortfolioUrl}
              placeholder="https://your-portfolio.com"
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              maxLength={200}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <InputSanitizer
              type="url"
              value={websiteUrl}
              onChange={setWebsiteUrl}
              placeholder="https://your-website.com"
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              maxLength={200}
            />
          </div>

          <div className="flex items-center justify-between space-x-2 pt-4 border-t">
            <div className="space-y-1">
              <Label htmlFor="showcase" className="flex items-center gap-2">
                {showInShowcase ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Show in Filmmaker Showcase
              </Label>
              <p className="text-sm text-muted-foreground">
                Display your profile publicly in the filmmaker showcase
              </p>
            </div>
            <Switch
              id="showcase"
              checked={showInShowcase}
              onCheckedChange={setShowInShowcase}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleProfileUpdate} 
            disabled={updating}
            className="w-full"
          >
            {updating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : "Save Profile"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileForm;
