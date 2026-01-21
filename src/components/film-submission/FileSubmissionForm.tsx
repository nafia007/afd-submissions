
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { fileFormSchema, FileFormValues } from "./types"
import { CommonFormFields } from "./CommonFormFields"
import { useState, useEffect } from "react"
import { useLoadingState } from "@/hooks/useLoadingState"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { AlertCircle, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileSubmissionFormProps {
  onSuccess?: () => void
}

export const FileSubmissionForm = ({ onSuccess }: FileSubmissionFormProps) => {
  const { loading, error, withLoading, setError } = useLoadingState()
  const [userId, setUserId] = useState<string | null>(null)
  
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Error getting session:", error)
          toast.error("Authentication error. Please sign in again.")
          return
        }
        setUserId(data.session?.user.id || null)
      } catch (err) {
        console.error("Error in getCurrentUser:", err)
        setError("Failed to authenticate user")
      }
    }
    
    getCurrentUser()
  }, [setError])
  
  const form = useForm<FileFormValues>({
    resolver: zodResolver(fileFormSchema),
    defaultValues: {
      title: "",
      description: "",
      director: "",
      price: "",
      tokenId: "",
      file: undefined
    },
  })

  const validateFile = (file: File): boolean => {
    const maxSize = 500 * 1024 * 1024; // 500MB
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
    
    if (file.size > maxSize) {
      toast.error("File size must be less than 500MB");
      return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid video file (MP4, MOV, or AVI)");
      return false;
    }
    
    return true;
  };

  const onSubmit = async (values: FileFormValues) => {
    if (!userId) {
      toast.error("You must be logged in to submit a film");
      return;
    }

    if (!validateFile(values.file)) {
      return;
    }

    await withLoading(async () => {
      const file = values.file;

      // Upload to IPFS via edge function
      const formData = new FormData();
      formData.append('file', file);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data: ipfsData, error: ipfsError } = await supabase.functions.invoke(
        'upload-to-ipfs',
        {
          body: formData,
        }
      );

      if (ipfsError) {
        console.error("IPFS upload error:", ipfsError);
        throw new Error(`IPFS upload failed: ${ipfsError.message}`);
      }

      console.log('IPFS upload successful:', ipfsData);

      // Insert film record with IPFS URL
      const { error: dbError } = await supabase
        .from('films')
        .insert({
          title: values.title.trim(),
          description: values.description.trim(),
          director: values.director.trim(),
          price: values.price,
          token_id: parseInt(values.tokenId),
          film_url: ipfsData.ipfsUrl, // Use IPFS URL
          user_id: userId
        });

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }

      toast.success("Film uploaded to IPFS and submitted successfully!", {
        description: `IPFS Hash: ${ipfsData.ipfsHash}`
      });
      
      form.reset();
      onSuccess?.();
    });
  };

  if (!userId) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You must be logged in to submit a film. Please sign in first.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <CommonFormFields form={form} />
        
        <FormField
          control={form.control}
          name="file"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Upload Film *</FormLabel>
              <FormControl>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:border-muted-foreground/50 transition-colors">
                  <Input 
                    type="file" 
                    accept="video/mp4,video/mov,video/avi,video/quicktime"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) onChange(file)
                    }}
                    className="cursor-pointer"
                    {...field}
                  />
                  <div className="mt-2 text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your film file here, or click to browse
                    </p>
                  </div>
                </div>
              </FormControl>
              <FormDescription>
                Upload your film file directly (supported formats: MP4, MOV, AVI - max 500MB)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <LoadingSpinner size="sm" text="Uploading..." />
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Film
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
