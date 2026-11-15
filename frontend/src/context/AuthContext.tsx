import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile } from '../types';
import { mockProfile } from '../services/mockData';

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signUp: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Demo/local development default user
      setUser({ id: mockProfile.id, email: 'alex@taskora.app' });
      setProfile(mockProfile);
      setLoading(false);
      return;
    }

    // Check active session in Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) {
        setProfile(data as Profile);
      }
    } catch (err) {
      console.warn('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (email: string) => {
    if (!isSupabaseConfigured) {
      setUser({ id: mockProfile.id, email });
      setProfile({ ...mockProfile, display_name: email.split('@')[0] });
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  };

  const signUp = async (email: string) => {
    if (!isSupabaseConfigured) {
      setUser({ id: mockProfile.id, email });
      setProfile({ ...mockProfile, display_name: email.split('@')[0] });
      return;
    }
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
