
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const initSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        localStorage.setItem('user_id', session.user.id);
        localStorage.setItem('user_email', session.user.email || '');
        localStorage.setItem('access_token', session.access_token);

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser({
            name: profile.name,
            email: session.user.email || '',
            role: profile.role,
            institute: profile.institute,
            mobile: profile.mobile
          });
        } else {
          setUser({
            name: session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: 'Student'
          });
        }
      } else {
        clearAuth();
      }
    } catch (e) {
      console.warn("Session check failed:", e);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('access_token');
    setUser(null);
  };

  useEffect(() => {
    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        localStorage.setItem('user_id', session.user.id);
        localStorage.setItem('user_email', session.user.email || '');
        localStorage.setItem('access_token', session.access_token);
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser({
            name: profile.name,
            email: session.user.email || '',
            role: profile.role,
            institute: profile.institute,
            mobile: profile.mobile
          });
        }
      } else if (event === 'SIGNED_OUT') {
        clearAuth();
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    clearAuth();
  };

  return { user, isAuthLoading, logout, setUser };
};
