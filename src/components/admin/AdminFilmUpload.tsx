import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Link, Film, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const urlSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  director: z.string().min(2, "Director name must be at least 2 characters"),
  price: z.string().regex(/^\d*\.?\d*$/, "Must be a valid price"),
  genre: z.string().optional(),
  year: z.string().optional(),
  filmUrl: z.string().url("Must be a valid URL"),
  posterUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const fileSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  director: z.string().min(2, "Director name must be at least 2 characters"),
  price: z.string().regex(/^\d*\.?\d*$/, "Must be a valid price"),
  genre: z.string().optional(),
  year: z.string().optional(),
});

type UrlFormValues = z.infer<typeof urlSchema>;
type FileFormValues = z.infer<typeof fileSchema>;

interface AdminFilmUploadProps {
  onSuccess?: () => void;
}

export const AdminFilmUpload = ({ onSuccess }: AdminFilmUploadProps) => {
  const [activeTab, setActiveTab] = useState("url");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  const urlForm = useForm<UrlFormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      title: "",
      description: "",
      director: "",
      price: "0",
      genre: "",
      year: "",
      filmUrl: "",
      posterUrl: "",
    },
  });

  const fileForm = useForm<FileFormValues>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      title: "",
      description: "",
      director: "",
      price: "0",
      genre: "",
      year: "",
    },
  });

  const validateVideoFile = (file: File): boolean => {
    const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/mov'];
    const allowedExtensions = ['.mp4', '.mov', '.avi'];
    
    const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    if (file.size > maxSize) {
      toast.error("File too large", { description: "Maximum file size is 2GB" });
      return false;
    }
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
      toast.error("Invalid file type", { description: "Please upload MP4, MOV, or AVI files" });
      return false;
    }
    
    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateVideoFile(file)) {
      setSelectedFile(file);
    }
  };

  const handlePosterSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid image type", { description: "Please upload JPG, PNG, or WebP images" });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image too large", { description: "Maximum image size is 10MB" });
        return;
      }
      setPosterFile(file);
    }
  };

  const uploadToStorage = async (file: File, bucket: string, path: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const onUrlSubmit = async (values: UrlFormValues) => {
    setUploading(true);
    setUploadStatus("Saving film...");
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in");
      }

      const { error } = await supabase.from('films').insert({
        title: values.title.trim(),
        description: values.description.trim(),
        director: values.director.trim(),
        price: values.price,
        genre: values.genre || null,
        year: values.year || null,
        film_url: values.filmUrl,
        video_url: values.filmUrl,
        poster_url: values.posterUrl || null,
        user_id: user.id,
      });

      if (error) throw error;

      toast.success("Film added successfully!");
      urlForm.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Error adding film:", error);
      toast.error("Failed to add film", { description: error.message });
    } finally {
      setUploading(false);
      setUploadStatus("");
    }
  };

  const onFileSubmit = async (values: FileFormValues) => {
    if (!selectedFile) {
      toast.error("Please select a video file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in");
      }

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedTitle = values.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const fileExtension = selectedFile.name.split('.').pop();
      const videoPath = `${user.id}/${sanitizedTitle}_${timestamp}.${fileExtension}`;

      setUploadStatus("Uploading video...");
      setUploadProgress(10);

      // Upload video to films bucket
      const videoUrl = await uploadToStorage(selectedFile, 'films', videoPath);
      setUploadProgress(70);

      // Upload poster if provided
      let posterUrl = null;
      if (posterFile) {
        setUploadStatus("Uploading poster...");
        const posterExtension = posterFile.name.split('.').pop();
        const posterPath = `posters/${sanitizedTitle}_${timestamp}.${posterExtension}`;
        posterUrl = await uploadToStorage(posterFile, 'films', posterPath);
      }
      setUploadProgress(90);

      setUploadStatus("Saving to database...");

      // Insert film record
      const { error } = await supabase.from('films').insert({
        title: values.title.trim(),
        description: values.description.trim(),
        director: values.director.trim(),
        price: values.price,
        genre: values.genre || null,
        year: values.year || null,
        film_url: videoUrl,
        video_url: videoUrl,
        poster_url: posterUrl,
        user_id: user.id,
      });

      if (error) throw error;

      setUploadProgress(100);
      toast.success("Film uploaded successfully!");
      
      // Reset form
      fileForm.reset();
      setSelectedFile(null);
      setPosterFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (posterInputRef.current) posterInputRef.current.value = '';
      
      onSuccess?.();
    } catch (error: any) {
      console.error("Error uploading film:", error);
      toast.error("Failed to upload film", { description: error.message });
    } finally {
      setUploading(false);
      setUploadStatus("");
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Film className="w-6 h-6" />
          Admin Film Upload
        </CardTitle>
        <CardDescription>
          Upload films via URL or direct file upload (MP4, MOV supported)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              URL Upload
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              File Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="mt-6">
            <Form {...urlForm}>
              <form onSubmit={urlForm.handleSubmit(onUrlSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={urlForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Film title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={urlForm.control}
                    name="director"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Director *</FormLabel>
                        <FormControl>
                          <Input placeholder="Director name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={urlForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Film description..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={urlForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={urlForm.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre</FormLabel>
                        <FormControl>
                          <Input placeholder="Drama, Action..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={urlForm.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input placeholder="2024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={urlForm.control}
                  name="filmUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Film URL *</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/video.mp4" type="url" {...field} />
                      </FormControl>
                      <FormDescription>
                        Direct video URL or streaming link (Vimeo, YouTube, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={urlForm.control}
                  name="posterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poster URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/poster.jpg" type="url" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional poster/thumbnail image URL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {uploadStatus}
                    </>
                  ) : (
                    <>
                      <Link className="w-4 h-4 mr-2" />
                      Add Film via URL
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="file" className="mt-6">
            <Form {...fileForm}>
              <form onSubmit={fileForm.handleSubmit(onFileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={fileForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Film title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={fileForm.control}
                    name="director"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Director *</FormLabel>
                        <FormControl>
                          <Input placeholder="Director name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={fileForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Film description..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={fileForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={fileForm.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre</FormLabel>
                        <FormControl>
                          <Input placeholder="Drama, Action..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={fileForm.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input placeholder="2024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Video File Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Video File *</label>
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/quicktime,video/x-msvideo,.mp4,.mov,.avi"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {selectedFile ? (
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                        <div>
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                        <p className="font-medium">Click to upload video</p>
                        <p className="text-sm text-muted-foreground">
                          MP4, MOV, or AVI (max 2GB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Poster Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Poster Image (Optional)</label>
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => posterInputRef.current?.click()}
                  >
                    <input
                      ref={posterInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePosterSelect}
                      className="hidden"
                    />
                    {posterFile ? (
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">{posterFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(posterFile.size)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Click to upload poster (JPG, PNG, WebP - max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{uploadStatus}</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Large files may take several minutes to upload. Do not close this page during upload.
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full" disabled={uploading || !selectedFile}>
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {uploadStatus}
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Film
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
