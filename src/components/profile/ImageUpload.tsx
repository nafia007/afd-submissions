import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, User, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface ImageUploadProps {
  userId: string;
  currentImageUrl?: string | null;
  onImageUploaded: (url: string) => void;
  size?: "sm" | "md" | "lg";
}

export default function ImageUpload({ 
  userId, 
  currentImageUrl, 
  onImageUploaded,
  size = "lg" 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('profile-images')
        .upload(fileName, file, {
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(data.path);

      // Update profile with new image URL
      const { error: updateError } = await supabase
        .from('filmmaker_profiles')
        .update({ profile_image_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      onImageUploaded(publicUrl);
      toast.success('Profile image updated successfully!');

    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setUploading(true);

      // Update profile to remove image URL
      const { error } = await supabase
        .from('filmmaker_profiles')
        .update({ profile_image_url: null })
        .eq('id', userId);

      if (error) throw error;

      setPreviewUrl(null);
      onImageUploaded('');
      toast.success('Profile image removed');

    } catch (error: any) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    } finally {
      setUploading(false);
    }
  };

  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <div className="relative">
          <Avatar className={sizeClasses[size]}>
            <AvatarImage src={displayImageUrl || ""} />
            <AvatarFallback className="bg-accent/10 text-accent">
              <User className="w-10 h-10" />
            </AvatarFallback>
          </Avatar>
          
          {uploading && (
            <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
              <LoadingSpinner size="sm" />
            </div>
          )}

          <Button
            variant="outline"
            size="icon"
            className="absolute -bottom-2 -right-2 rounded-full h-8 w-8"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            {currentImageUrl ? 'Change' : 'Upload'}
          </Button>

          {currentImageUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
              disabled={uploading}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4" />
              Remove
            </Button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <p className="text-xs text-muted-foreground text-center">
          JPG, PNG or GIF. Max 5MB.
        </p>
      </CardContent>
    </Card>
  );
}