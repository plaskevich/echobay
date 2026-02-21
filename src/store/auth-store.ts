import { create } from 'zustand';

import type { Subscription, User } from '@supabase/supabase-js';

import { getCurrentUser, getSession, logInWithEmail, onAuthStateChange, signOut, signUpWithEmail } from '@/api/auth';
import { insertProfileIfNotExists } from '@/api/profile';

let authSubscription: Subscription | null = null;

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  isRecoveryMode: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearRecoveryMode: () => void;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  logIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<() => void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  isRecoveryMode: false,

  setUser: (user) => set({ user }),

  setLoading: (isLoading) => set({ isLoading }),

  clearRecoveryMode: () => set({ isRecoveryMode: false }),

  signUp: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await signUpWithEmail(email, password);

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
      const { data, error } = await logInWithEmail(email, password);

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
      await signOut();
      set({ user: null });
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  initialize: async () => {
    if (get().isInitialized) {
      return () => {};
    }

    set({ isLoading: true });
    try {
      const {
        data: { session },
      } = await getSession();

      if (session?.user) {
        const freshUser = await getCurrentUser();
        set({ user: freshUser ?? session.user });
      }

      if (authSubscription) {
        authSubscription.unsubscribe();
      }

      const { data } = onAuthStateChange((event, session) => {
        if (event === 'INITIAL_SESSION') return;
        set({ user: session?.user ?? null });
        if (event === 'PASSWORD_RECOVERY') {
          set({ isRecoveryMode: true });
        }
        if (session?.user) {
          createProfile(session.user);
        }
      });
      authSubscription = data.subscription;

      set({ isInitialized: true });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ isInitialized: true });
    } finally {
      set({ isLoading: false });
    }

    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
        authSubscription = null;
      }
    };
  },
}));

async function createProfile(user: User) {
  try {
    const { error } = await insertProfileIfNotExists({
      id: user.id,
      username: user.email?.split('@')[0] || 'user',
      avatar_url: user.user_metadata?.avatar_url || '',
    });

    if (error) {
      if (!error.message.includes('duplicate key')) {
        console.error('Error ensuring profile exists:', error);
      }
    }
  } catch (error) {
    console.error('Error ensuring profile exists:', error);
  }
}
