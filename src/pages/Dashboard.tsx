
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { toast } from "sonner"
import AuthGuard from "@/components/auth/AuthGuard"

interface UserProfile {
  id: string
  role: 'admin' | 'user'
  email: string
  created_at: string
  last_sign_in_at: string | null
}

const Dashboard = () => {
  const navigate = useNavigate()

  // Fetch user profiles
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['user-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_user_profiles_for_admin')

      if (error) throw error
      return data as UserProfile[]
    }
  })

  if (error) {
    toast.error("Failed to load user data")
  }

  return (
    <AuthGuard requireAdmin={true}>
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="font-heading text-4xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-foreground/70 max-w-2xl">
              View and manage user accounts in the Holocene IP Marketplace.
            </p>
          </div>

          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Last Sign In</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>{format(new Date(user.created_at), 'PPp')}</TableCell>
                    <TableCell>
                      {user.last_sign_in_at 
                        ? format(new Date(user.last_sign_in_at), 'PPp')
                        : 'Never'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default Dashboard
