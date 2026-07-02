import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AdminAuthState = {
  loading: boolean;
  userId: string | null;
  isAdmin: boolean;
  email: string | null;
};

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({
    loading: true,
    userId: null,
    isAdmin: false,
    email: null,
  });

  useEffect(() => {
    let mounted = true;

    const check = async (userId: string | null, email: string | null) => {
      if (!userId) {
        if (mounted) setState({ loading: false, userId: null, isAdmin: false, email: null });
        return;
      }
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      if (mounted) {
        setState({
          loading: false,
          userId,
          email,
          isAdmin: !error && data === true,
        });
      }
    };

    supabase.auth.getSession().then(({ data }) => {
      check(data.session?.user?.id ?? null, data.session?.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      check(session?.user?.id ?? null, session?.user?.email ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}