import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile } from '../types';
import { mockProfile } from '../services/mockData';

const PROFILE_STORAGE_KEY = 'taskora_personal_profile';

interface AuthContextType {
  user: { id: string; email: string };
  profile: Profile;
  loading: boolean;
  updateProfile: (updates: Partial<Profile>) => void;
  signIn: (email: string) => Promise<void>;
  signUp: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>(() => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return {
      ...mockProfile,
      display_name: 'Saad',
    };
  });

  const [user] = useState<{ id: string; email: string }>({
    id: profile.id,
    email: 'saad@personal.app',
  });

  const updateProfile = (updates: Partial<Profile>) => {
    const updated = { ...profile, ...updates, updated_at: new Date().toISOString() };
    setProfile(updated);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  const signIn = async () => {};
  const signUp = async () => {};
  const signOut = async () => {};

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading: false,
        updateProfile,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
