
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileUp, Shield } from "lucide-react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import AFDUploadForm from "./AFDUploadForm";

type Tier = "development" | "finished_script" | "post_production" | "complete_seeking_distribution";

interface AFDEntry {
  id: string;
  user_id: string;
  title: string;
  description: string;
  director: string;
  tier: Tier;
  file_url: string;
  file_type: string;
  created_at: string;
}

const TIER_LABELS: Record<Tier, string> = {
  development: "Development",
  finished_script: "Finished Script",
  post_production: "Post-production",
  complete_seeking_distribution: "Complete and seeking distribution",
};

export default function AFDSubmissions() {
  const [activeTier, setActiveTier] = useState<Tier | "all">("all");
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  
  const { data, isLoading, refetch } = useQuery<AFDEntry[]>({
    queryKey: ["afd-submissions", activeTier],
    queryFn: async () => {
      // Only admins can fetch submissions
      if (!isAdmin) {
        return [];
      }
      
      let query = supabase.from("afd_submissions").select("*").order("created_at", { ascending: false });
      if (activeTier !== "all") {
        query = query.eq("tier", activeTier);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as AFDEntry[];
    },
    enabled: isAdmin && !adminLoading, // Only run query when admin is confirmed
  });

  // Show loading state while checking admin status
  if (adminLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AFDUploadForm onSuccess={refetch} />
      
      {/* Only show submissions section to admins */}
      {isAdmin && (
        <>
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <button
              className={`px-3 py-1 rounded border text-sm ${activeTier === "all" ? "bg-accent font-bold" : "bg-muted"}`}
              onClick={() => setActiveTier("all")}
            >
              All Tiers
            </button>
            {Object.entries(TIER_LABELS).map(([tier, label]) => (
              <button
                key={tier}
                className={`px-3 py-1 rounded border text-sm ${activeTier === tier ? "bg-accent font-bold" : "bg-muted"}`}
                onClick={() => setActiveTier(tier as Tier)}
              >
                {label}
              </button>
            ))}
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : data && data.length > 0 ? (
            <div className="space-y-4">
              {data.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader>
                    <CardTitle>
                      {entry.title} <span className="ml-2 text-xs font-normal bg-muted px-2 py-0.5 rounded">{TIER_LABELS[entry.tier]}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <p className="text-muted-foreground text-sm">{entry.description}</p>
                    <div className="text-xs text-slate-500">Director: {entry.director}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <FileUp className="w-4 h-4" />
                       <a
                        className="underline text-accent font-medium"
                        href={entry.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {entry.tier === "development" || entry.tier === "finished_script" ? "Download Script" : "View Video"}
                      </a>
                      <span className="ml-2 text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              No submissions yet for this tier.
            </div>
          )}
        </>
      )}
    </div>
  );
}
