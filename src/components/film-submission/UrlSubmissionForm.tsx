
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { urlFormSchema, UrlFormValues } from "./types"
import { CommonFormFields } from "./CommonFormFields"
import { useEffect, useState } from "react"
import { useLoadingState } from "@/hooks/useLoadingState"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { AlertCircle, Send } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UrlSubmissionFormProps {
  onSuccess?: () => void
}

export const UrlSubmissionForm = ({ onSuccess }: UrlSubmissionFormProps) => {
  const { loading, error, withLoading, setError } = useLoadingState()
  const [userId, setUserId] = useState<string | null>(null)
  
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Error fetching user session:", error)
          toast.error("Authentication error", {
            description: "Please try signing in again."
          })
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
  
  const form = useForm<UrlFormValues>({
    resolver: zodResolver(urlFormSchema),
    defaultValues: {
      title: "",
      description: "",
      director: "",
      price: "",
      filmUrl: "",
      tokenId: ""
    },
  })

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      toast.error("Please enter a valid URL");
      return false;
    }
  };

  const onSubmit = async (values: UrlFormValues) => {
    if (!userId) {
      toast.error("Authentication required", {
        description: "You must be logged in to submit a film. Please sign in and try again."
      })
      return
    }

    if (!validateUrl(values.filmUrl)) {
      return;
    }
    
    await withLoading(async () => {
      const { error } = await supabase
        .from('films')
        .insert({
          title: values.title.trim(),
          description: values.description.trim(),
          director: values.director.trim(),
          price: values.price,
          token_id: values.tokenId ? parseInt(values.tokenId) : null,
          film_url: values.filmUrl,
          user_id: userId
        })

      if (error) {
        console.error("Error submitting film:", error)
        throw new Error(error.message || "Failed to submit film")
      }

      toast.success("Film submitted successfully!", {
        description: "Your film has been listed on the marketplace.",
      })
      
      form.reset()
      onSuccess?.()
    });
  }

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
          name="filmUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Film URL *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://vimeo.com/your-film" 
                  type="url" 
                  {...field} 
                  className="w-full"
                />
              </FormControl>
              <FormDescription>
                Provide a URL where your film can be previewed (e.g., Vimeo, YouTube, or private streaming link)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <LoadingSpinner size="sm" text="Submitting..." />
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Film
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
