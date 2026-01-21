import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserProfile {
  id: string;
  role: 'admin' | 'user';
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

interface UserManagementTableProps {
  users: UserProfile[];
  isLoading: boolean;
  onUserUpdate: () => void;
}

export const UserManagementTable = ({ users, isLoading, onUserUpdate }: UserManagementTableProps) => {
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const handleDeleteUser = async (userId: string, email: string) => {
    setDeletingUserId(userId);
    try {
      // Call the edge function that uses service role key to delete user
      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        body: { userId }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success(`User ${email} deleted successfully`);
      onUserUpdate();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(`Failed to delete user: ${error.message}`);
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`User role updated to ${newRole}`);
      onUserUpdate();
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast.error(`Failed to update user role: ${error.message}`);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Last Sign In</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              Loading users...
            </TableCell>
          </TableRow>
        ) : users?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              No users found
            </TableCell>
          </TableRow>
        ) : (
          users?.map((userProfile) => (
            <TableRow key={userProfile.id}>
              <TableCell className="font-medium">{userProfile.email}</TableCell>
              <TableCell>
                <Badge variant={userProfile.role === 'admin' ? 'default' : 'secondary'}>
                  {userProfile.role}
                </Badge>
              </TableCell>
              <TableCell>
                {userProfile.created_at ? format(new Date(userProfile.created_at), 'PPp') : 'N/A'}
              </TableCell>
              <TableCell>
                {userProfile.last_sign_in_at 
                  ? format(new Date(userProfile.last_sign_in_at), 'PPp')
                  : 'Never'}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleRole(userProfile.id, userProfile.role)}
                    className="flex items-center gap-2"
                  >
                    <UserCog className="w-4 h-4" />
                    Toggle Role
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={deletingUserId === userProfile.id}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete user "{userProfile.email}"? 
                          This action cannot be undone and will remove all their data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteUser(userProfile.id, userProfile.email)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete User
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};