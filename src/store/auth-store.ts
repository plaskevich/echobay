import { create } from 'zustand';

import type { User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  logIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  setUser: (user) => set({ user }),

  setLoading: (isLoading) => set({ isLoading }),

  signUp: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        set({ user: data.user });
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      set({ isLoading: false });
    }
  },

  logIn: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        set({ user: data.user });
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      set({ user: null });
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  initialize: async () => {
    set({ isLoading: true });
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        set({ user: session.user });
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        set({ user: session?.user ?? null });
        if (session?.user) {
          await createProfile(session.user);
        }
      });

      set({ isInitialized: true });
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

async function createProfile(user: User) {
  try {
    const { error } = await supabase.from('profiles').upsert(
      {
        id: user.id,
        username: user.email?.split('@')[0] || 'user',
        avatar_url: user.user_metadata?.avatar_url || '',
      },
      {
        onConflict: 'id',
        ignoreDuplicates: true,
      }
    );

    if (error) {
      if (!error.message.includes('duplicate key')) {
        console.error('Error ensuring profile exists:', error);
      }
    }
  } catch (error) {
    console.error('Error ensuring profile exists:', error);
  }
}
