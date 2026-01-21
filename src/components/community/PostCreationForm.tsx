import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X, Plus, FileText, Briefcase, DollarSign, Star, Upload, ImageIcon, File as FileIcon, Video } from "lucide-react";
import { toast } from "sonner";

interface PostFormData {
  post_type: 'general' | 'news' | 'funding' | 'jobs' | 'showcase';
  title?: string;
  content: string;
  image_url?: string;
  tags: string[];
  funding_amount?: string;
  job_location?: string;
  job_salary?: string;
  external_url?: string;
}

const POST_TYPES = [
  { value: 'general', label: 'General Discussion', icon: FileText, color: 'bg-slate-100 text-slate-700' },
  { value: 'news', label: 'Film News', icon: FileText, color: 'bg-blue-100 text-blue-700' },
  { value: 'funding', label: 'Funding Opportunity', icon: DollarSign, color: 'bg-green-100 text-green-700' },
  { value: 'jobs', label: 'Job Posting', icon: Briefcase, color: 'bg-purple-100 text-purple-700' },
  { value: 'showcase', label: 'Showcase Work', icon: Star, color: 'bg-yellow-100 text-yellow-700' },
];

export default function PostCreationForm() {
  const { user } = useAuthState();
  const [formData, setFormData] = useState<PostFormData>({
    post_type: 'general',
    content: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async (data: PostFormData) => {
      if (!user) throw new Error("You must be signed in to post.");
      
      setUploadingFiles(true);
      const attachments: any[] = [];
      
      // Upload files to storage if any
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('post-attachments')
            .upload(fileName, file);
          
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('post-attachments')
            .getPublicUrl(fileName);
          
          const fileType = file.type.startsWith('image/') 
            ? 'image' 
            : file.type.startsWith('video/') 
              ? 'video' 
              : 'file';
          
          attachments.push({
            url: publicUrl,
            name: file.name,
            type: fileType,
            mime_type: file.type,
          });
        }
      }
      
      const postData = {
        user_id: user.id,
        post_type: data.post_type,
        title: data.title || null,
        content: data.content,
        image_url: data.image_url || null,
        tags: data.tags,
        funding_amount: data.funding_amount || null,
        job_location: data.job_location || null,
        job_salary: data.job_salary || null,
        external_url: data.external_url || null,
        attachments,
      };

      const { error } = await supabase.from("posts").insert(postData);
      if (error) throw error;
    },
    onSuccess: () => {
      setFormData({ post_type: 'general', content: '', tags: [] });
      setSelectedFiles([]);
      setIsExpanded(false);
      setUploadingFiles(false);
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast.success("Post created successfully!");
    },
    onError: (err: any) => {
      setUploadingFiles(false);
      toast.error(err.message || "Could not create post.");
    },
  });

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;
    createPost(formData);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isDocument = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type);
      
      // Videos have a 50MB limit, other files 10MB
      const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      const isUnderLimit = file.size <= maxSize;
      
      if (!isUnderLimit) {
        toast.error(`${file.name} is too large (max ${isVideo ? '50MB' : '10MB'})`);
        return false;
      }
      if (!isImage && !isVideo && !isDocument) {
        toast.error(`${file.name} is not a supported file type`);
        return false;
      }
      return true;
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const selectedType = POST_TYPES.find(type => type.value === formData.post_type);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {selectedType?.icon && <selectedType.icon className="w-5 h-5" />}
          Share with the Community
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select 
              value={formData.post_type} 
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, post_type: value as PostFormData['post_type'] }));
                setIsExpanded(true);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select post type" />
              </SelectTrigger>
              <SelectContent>
                {POST_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isExpanded && (
              <>
                {(formData.post_type !== 'general') && (
                  <Input
                    placeholder="Post title..."
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="font-medium"
                  />
                )}

                <Textarea
                  placeholder={`Share your ${formData.post_type === 'general' ? 'thoughts' : selectedType?.label.toLowerCase()}...`}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  maxLength={2000}
                  className="min-h-[120px]"
                  disabled={isPending}
                />

                {formData.post_type === 'funding' && (
                  <Input
                    placeholder="Funding amount (e.g., $10K - $50K)"
                    value={formData.funding_amount || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, funding_amount: e.target.value }))}
                  />
                )}

                {formData.post_type === 'jobs' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Location"
                      value={formData.job_location || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, job_location: e.target.value }))}
                    />
                    <Input
                      placeholder="Salary range"
                      value={formData.job_salary || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, job_salary: e.target.value }))}
                    />
                  </div>
                )}

                <Input
                  placeholder="External link (optional)"
                  value={formData.external_url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, external_url: e.target.value }))}
                  type="url"
                />

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tags..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1"
                    />
                    <Button type="button" onClick={addTag} variant="outline" size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formData.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-red-500" 
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Attachments (Optional)</Label>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-md hover:bg-muted/50 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm">
                          {selectedFiles.length > 0 
                            ? `${selectedFiles.length} file(s) selected` 
                            : "Upload images, videos, or files (max 5)"}
                        </span>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={uploadingFiles}
                      />
                    </label>
                    
                    {/* File preview */}
                    {selectedFiles.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                              {file.type.startsWith('image/') ? (
                                <ImageIcon className="w-4 h-4 shrink-0" />
                              ) : file.type.startsWith('video/') ? (
                                <Video className="w-4 h-4 shrink-0" />
                              ) : (
                                <FileIcon className="w-4 h-4 shrink-0" />
                              )}
                              <span className="text-xs truncate flex-1">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsExpanded(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isPending || uploadingFiles || !formData.content.trim()}
                    className="min-w-20"
                  >
                    {uploadingFiles ? "Uploading..." : isPending ? "Posting..." : "Post"}
                  </Button>
                </div>
              </>
            )}

            {!isExpanded && (
              <Textarea
                placeholder="What's happening in the film world?"
                value={formData.content}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, content: e.target.value }));
                  setIsExpanded(true);
                }}
                className="min-h-[60px]"
              />
            )}
          </form>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Please log in to share with the community.
          </p>
        )}
      </CardContent>
    </Card>
  );
}