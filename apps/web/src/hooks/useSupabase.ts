import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UseSupabaseAuthProps {
  redirectTo?: string;
}

export function useSupabaseAuth({ redirectTo }: UseSupabaseAuthProps = {}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session from supabase when component mounts
    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Set up listener for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle redirects if needed
      if (redirectTo && session) {
        window.location.href = redirectTo;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [redirectTo]);

  return { user, session, loading };
}

export default useSupabaseAuth;
