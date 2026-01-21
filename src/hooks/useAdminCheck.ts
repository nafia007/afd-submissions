import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function useAdminCheck() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user && !authLoading) {
        try {
          // Use the secure database function to check admin role
          const { data, error } = await supabase.rpc('get_current_user_role');
          
          if (error) {
            console.error("Error checking admin role:", error);
            setIsAdmin(false);
          } else {
            setIsAdmin(data === 'admin');
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };

    if (!authLoading) {
      checkAdminRole();
    }
  }, [user, authLoading]);

  return { isAdmin, loading: loading || authLoading };
}