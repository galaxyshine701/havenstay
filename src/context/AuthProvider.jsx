import { useCallback, useEffect, useMemo, useState } from 'react';
import AuthContext from './authContext';
import { supabase } from '../lib/supabaseClient';

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Keep the session in sync with Supabase (sign in, sign out, token refresh).
  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load the profile row (created by a database trigger when the user signs up).
  // This is a separate effect: calling Supabase inside onAuthStateChange can deadlock.
  const userId = session?.user?.id ?? null;
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return undefined;
    }

    let active = true;
    supabase
      .from('profiles')
      .select('full_name, phone')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setProfile(data ?? null);
      });

    return () => {
      active = false;
    };
  }, [userId]);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signUp = useCallback(async ({ email, password, fullName }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    // No session after a successful sign-up means "confirm your email first" is switched on.
    return { error, needsConfirmation: !error && !data.session };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [session, profile, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
