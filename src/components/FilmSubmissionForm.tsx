
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

// Simplified schema for streaming service
const filmSchema = z.object({
  title: z.string().min(1, "Title is required"),
  director: z.string().min(1, "Director is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  film_url: z.string().url("Must be a valid URL"),
  video_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  genre: z.string().optional(),
  year: z.string().optional(),
});

type FilmFormValues = z.infer<typeof filmSchema>;

interface FilmSubmissionFormProps {
  onSuccess?: () => void;
}

const FilmSubmissionForm = ({ onSuccess }: FilmSubmissionFormProps) => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Get user ID on component mount
  useEffect(() => {
    const getUserId = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
        return;
      }
      setUserId(data.session?.user.id || null);
    };

    getUserId();
  }, []);

  // Initialize form with validation
  const form = useForm<FilmFormValues>({
    resolver: zodResolver(filmSchema),
    defaultValues: {
      title: "",
      director: "",
      description: "",
      film_url: "",
      video_url: "",
      genre: "",
      year: "",
    },
  });

  const onSubmit = async (data: FilmFormValues) => {
    setLoading(true);
    try {
      // Check if user is authenticated
      if (!userId) {
        toast.error("You must be logged in to submit a film");
        return;
      }
      
      console.log("Submitting film for user:", userId);
      
      // Submit film with user_id
      const { error } = await supabase
        .from("films")
        .insert({
          title: data.title.trim(),
          director: data.director.trim(),
          description: data.description.trim(),
          film_url: data.film_url.trim(),
          video_url: data.video_url?.trim() || null,
          genre: data.genre?.trim() || null,
          year: data.year?.trim() || null,
          price: "0", // Free for streaming
          user_id: userId
        });

      if (error) {
        console.error("Error submitting film:", error);
        throw error;
      }

      console.log("Film submitted successfully");
      toast.success("Film submitted successfully!");
      form.reset();
      
      // Call onSuccess callback if provided
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error submitting film:", error);
      toast.error(error.message || "Failed to submit film");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Film Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter film title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="director"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Director</FormLabel>
                <FormControl>
                  <Input placeholder="Enter director name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of your film..."
                  {...field}
                  rows={4}
                  className="resize-y"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Drama, Comedy, Thriller" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Release Year (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="2024" type="number" min="1900" max="2030" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="film_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Film URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://vimeo.com/your-film" 
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="video_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trailer URL (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://youtube.com/watch?v=..." 
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full"
          disabled={loading || !userId}
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Film...
            </>
          ) : !userId ? "Login Required" : "Add Film to Streaming Platform"}
        </Button>
        
        {!userId && (
          <p className="text-sm text-destructive text-center mt-2">
            You must be logged in to submit a film
          </p>
        )}
      </form>
    </Form>
  );
};

export default FilmSubmissionForm;
