import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Download, Eye, CheckCircle, XCircle, MessageSquare, Film, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AFDSubmission {
  id: string;
  title: string;
  director: string;
  genre: string;
  country_of_origin: string;
  country_of_production: string;
  format: string;
  budget: string;
  partners: string;
  tier: string;
  file_type: string;
  file_url: string;
  description: string;
  created_at: string;
  user_id: string;
  approval_status?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  admin_notes?: string;
  showcase?: boolean;
}

interface SubmissionReviewCardProps {
  submission: AFDSubmission;
  onStatusUpdate: () => void;
  onDownload: (fileUrl: string, fileName: string) => void;
  onView: (fileUrl: string, title: string) => void;
}

export const SubmissionReviewCard = ({ 
  submission, 
  onStatusUpdate, 
  onDownload, 
  onView 
}: SubmissionReviewCardProps) => {
  const [adminNotes, setAdminNotes] = useState(submission.admin_notes || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAddingToMarketplace, setIsAddingToMarketplace] = useState(false);

  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('afd_submissions')
        .update({
          approval_status: status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          admin_notes: adminNotes || null
        })
        .eq('id', submission.id);

      if (error) throw error;

      toast.success(`Submission ${status}`);
      onStatusUpdate();
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Failed to update submission');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddToMarketplace = async () => {
    setIsAddingToMarketplace(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if film already exists
      const { data: existingFilm } = await supabase
        .from('films')
        .select('id')
        .eq('title', submission.title)
        .eq('director', submission.director)
        .maybeSingle();

      if (existingFilm) {
        toast.error('Film already exists in marketplace');
        return;
      }

      // Add to films table
      const { error } = await supabase.from('films').insert({
        title: submission.title,
        description: submission.description,
        director: submission.director,
        price: submission.budget || '0',
        genre: submission.genre || null,
        year: new Date().getFullYear().toString(),
        film_url: submission.file_url,
        video_url: submission.file_url,
        poster_url: null,
        user_id: submission.user_id,
      });

      if (error) throw error;

      // Mark submission as showcased
      await supabase
        .from('afd_submissions')
        .update({ showcase: true })
        .eq('id', submission.id);

      toast.success('Film added to marketplace successfully!');
      onStatusUpdate();
    } catch (error: any) {
      console.error('Error adding to marketplace:', error);
      toast.error('Failed to add to marketplace', { description: error.message });
    } finally {
      setIsAddingToMarketplace(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending Review</Badge>;
    }
  };

  return (
    <Card className="border border-border/50">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header with Title and Status */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-xl text-foreground">{submission.title}</h3>
                  <p className="text-muted-foreground">by {submission.director}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Submitted: {format(new Date(submission.created_at), 'PPp')}
                  </p>
                  {submission.reviewed_at && (
                    <p className="text-xs text-muted-foreground">
                      Reviewed: {format(new Date(submission.reviewed_at), 'PPp')}
                    </p>
                  )}
                </div>
                {getStatusBadge(submission.approval_status || 'pending')}
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <Badge variant="outline">
                {submission.tier.replace('_', ' ').toUpperCase()}
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(submission.file_url, `${submission.title}-pitch-deck.pdf`)}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(submission.file_url, submission.title)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </Button>
              </div>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Format:</span>
              <p className="text-sm">{submission.format || 'Not specified'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Genre:</span>
              <p className="text-sm">{submission.genre || 'Not specified'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Budget:</span>
              <p className="text-sm">{submission.budget || 'Not specified'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Country of Origin:</span>
              <p className="text-sm">{submission.country_of_origin || 'Not specified'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Country of Production:</span>
              <p className="text-sm">{submission.country_of_production || 'Not specified'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">File Type:</span>
              <p className="text-sm">{submission.file_type}</p>
            </div>
          </div>

          {/* Synopsis/Description */}
          {submission.description && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Log-Line & Synopsis:</span>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{submission.description}</p>
              </div>
            </div>
          )}

          {/* Partners */}
          {submission.partners && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-muted-foreground">Partners & Collaborators:</span>
              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{submission.partners}</p>
              </div>
            </div>
          )}

          {/* Admin Notes */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Admin Notes:
            </span>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add review notes (optional)..."
              className="min-h-[80px]"
            />
          </div>

          {/* Action Buttons */}
          {submission.approval_status === 'pending' && (
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                onClick={() => handleStatusUpdate('approved')}
                disabled={isUpdating}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </Button>
              <Button
                onClick={() => handleStatusUpdate('rejected')}
                disabled={isUpdating}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
            </div>
          )}

          {/* Add to Marketplace Button - Only for approved submissions */}
          {submission.approval_status === 'approved' && !submission.showcase && (
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                onClick={handleAddToMarketplace}
                disabled={isAddingToMarketplace}
                className="flex items-center gap-2 bg-accent hover:bg-accent/90"
              >
                {isAddingToMarketplace ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Film className="w-4 h-4" />
                )}
                Add to Marketplace (Stream)
              </Button>
            </div>
          )}

          {/* Already in Marketplace */}
          {submission.showcase && (
            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <Badge className="bg-accent/20 text-accent hover:bg-accent/20">
                <Film className="w-3 h-3 mr-1" />
                Added to Marketplace
              </Badge>
            </div>
          )}

          {/* Previous Admin Notes (if reviewed) */}
          {submission.admin_notes && submission.approval_status !== 'pending' && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Previous Admin Notes:</span>
              <p className="text-sm mt-1">{submission.admin_notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};