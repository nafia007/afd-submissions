
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const TIER_OPTIONS = [
  { value: "development", label: "Development" },
  { value: "finished_script", label: "Finished Script" },
  { value: "post_production", label: "Post-production" },
  { value: "complete_seeking_distribution", label: "Complete and seeking distribution" },
];

const ACCEPTED_FORMATS: Record<string, string[]> = {
  development: [".pdf", ".docx", ".txt", ".rtf"],
  finished_script: [".pdf", ".docx", ".txt", ".rtf"],
  post_production: [".mp4", ".mov", ".avi"],
  complete_seeking_distribution: [".mp4", ".mov", ".avi"],
};

const bucket = "afd-uploads";

export default function AFDUploadForm({ onSuccess }: { onSuccess: () => void }) {
  const [tier, setTier] = useState("development");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [director, setDirector] = useState("");
  const [format, setFormat] = useState("");
  const [genre, setGenre] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [countryOfProduction, setCountryOfProduction] = useState("");
  const [budget, setBudget] = useState("");
  const [partners, setPartners] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFile(e.target.files[0]);
  };

  const resetForm = () => {
    setTier("development");
    setTitle("");
    setDescription("");
    setDirector("");
    setFormat("");
    setGenre("");
    setCountryOfOrigin("");
    setCountryOfProduction("");
    setBudget("");
    setPartners("");
    setFile(null);
  };

  const isValidFile = (): boolean => {
    if (!file) return false;
    const allowed = ACCEPTED_FORMATS[tier];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    return allowed.includes(ext);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file.");
      return;
    }
    if (!isValidFile()) {
      toast.error("Invalid file format for selected tier.");
      return;
    }
    setUploading(true);
    try {
      // Get user session first
      const session = await supabase.auth.getSession();
      const user_id = session.data.session?.user?.id;
      const userEmail = session.data.session?.user?.email;
      
      if (!user_id || !userEmail) {
        toast.error("You must be signed in to submit!");
        setUploading(false);
        return;
      }

      // Upload file to Supabase Storage with user ID in path
      const uploadPath = `${user_id}/${tier}/${Date.now()}_${file.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from(bucket)
        .upload(uploadPath, file);

      if (storageError) {
        toast.error("Upload failed: " + storageError.message);
        setUploading(false);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(uploadPath);

      // Insert into afd_submissions
      const { error: dbError } = await supabase.from("afd_submissions").insert({
        user_id,
        title,
        description,
        director,
        tier,
        format,
        genre,
        country_of_origin: countryOfOrigin,
        country_of_production: countryOfProduction,
        budget,
        partners,
        file_url: publicUrlData.publicUrl,
        file_type: file.type,
      });

      if (dbError) {
        toast.error("Database save failed: " + dbError.message);
        setUploading(false);
        return;
      }

      // Send email notifications
      try {
        await supabase.functions.invoke('send-afd-notification', {
          body: {
            userEmail,
            title,
            director,
            tier,
            description: description || ''
          }
        });
      } catch (emailError: any) {
        console.error("Email notification failed:", emailError);
        // Don't fail the submission if email fails
      }

      toast.success("Submission uploaded successfully!");
      resetForm();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error("Error uploading submission: " + err.message);
    }
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Submit a new Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="block font-semibold">Tier</label>
            <select
              className="w-full border border-border rounded px-3 py-2"
              value={tier}
              onChange={(e) => setTier(e.target.value)}
            >
              {TIER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Title</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Project Title"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Log-Line and Synopsis</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Short project description"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Director</label>
            <Input
              type="text"
              value={director}
              onChange={(e) => setDirector(e.target.value)}
              required
              placeholder="Director's Name"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Format</label>
            <Input
              type="text"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              placeholder="e.g., Feature Film, Short Film, Documentary"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Genre</label>
            <Input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g., Drama, Comedy, Thriller"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Country of Origin</label>
            <Input
              type="text"
              value={countryOfOrigin}
              onChange={(e) => setCountryOfOrigin(e.target.value)}
              placeholder="Country where the story originates"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Country of Production</label>
            <Input
              type="text"
              value={countryOfProduction}
              onChange={(e) => setCountryOfProduction(e.target.value)}
              placeholder="Country where the film is produced"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Budget</label>
            <Input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Estimated or actual budget"
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Partners</label>
            <Textarea
              value={partners}
              onChange={(e) => setPartners(e.target.value)}
              placeholder="Production partners, co-producers, distributors, etc."
            />
          </div>
          <div className="space-y-2">
            <label className="block font-semibold">Pitch Deck</label>
            <Input
              type="file"
              required
              accept={ACCEPTED_FORMATS[tier].join(",")}
              onChange={handleFileChange}
              disabled={uploading}
            />
            <p className="text-xs text-muted-foreground">
              Upload your pitch deck including format, genre, country of origin, country of production, budget and all other relevant information. Accepted: {ACCEPTED_FORMATS[tier].join(", ").toUpperCase()}
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? "Uploading..." : "Submit"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
