import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Send, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  id: string;
  role: 'admin' | 'user';
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

interface AdminUserMessagingProps {
  users: UserProfile[];
  selectedUserId?: string;
}

export const AdminUserMessaging = ({ users, selectedUserId }: AdminUserMessagingProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [recipient, setRecipient] = useState<string>(selectedUserId || "all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in both subject and message");
      return;
    }

    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    setSending(true);
    try {
      if (recipient === "all") {
        // Send to all users
        const messagePromises = users.map((u) =>
          supabase.from("messages").insert({
            sender_id: user.id,
            receiver_id: u.id,
            subject: `[Admin Notification] ${subject}`,
            content: message,
          })
        );
        
        const results = await Promise.all(messagePromises);
        const errors = results.filter((r) => r.error);
        
        if (errors.length > 0) {
          console.error("Some messages failed:", errors);
          toast.warning(`Sent to ${users.length - errors.length}/${users.length} users`);
        } else {
          toast.success(`Message sent to all ${users.length} users`);
        }
      } else {
        // Send to individual user
        const { error } = await supabase.from("messages").insert({
          sender_id: user.id,
          receiver_id: recipient,
          subject: `[Admin Notification] ${subject}`,
          content: message,
        });

        if (error) throw error;
        
        const targetUser = users.find((u) => u.id === recipient);
        toast.success(`Message sent to ${targetUser?.email || "user"}`);
      }

      setSubject("");
      setMessage("");
      setOpen(false);
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(`Failed to send message: ${error.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleExportCSV = () => {
    if (!users || users.length === 0) {
      toast.error("No users to export");
      return;
    }

    // Create CSV content
    const headers = ["Email", "Role", "Created At", "Last Sign In"];
    const csvRows = [headers.join(",")];

    users.forEach((user) => {
      const row = [
        `"${user.email}"`,
        user.role,
        user.created_at ? new Date(user.created_at).toISOString() : "",
        user.last_sign_in_at ? new Date(user.last_sign_in_at).toISOString() : "Never",
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${users.length} users to CSV`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        onClick={handleExportCSV}
        className="flex items-center gap-2"
        disabled={!users || users.length === 0}
      >
        <Download className="w-4 h-4" />
        Export CSV ({users?.length || 0})
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Send Message
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Admin Message</DialogTitle>
            <DialogDescription>
              Send a notification message to users. Messages will appear in their inbox.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Select value={recipient} onValueChange={setRecipient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users ({users.length})</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter message subject"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={sending}>
              {sending ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
