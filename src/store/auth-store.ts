import { create } from 'zustand';

import type { Subscription, User } from '@supabase/supabase-js';

import { getCurrentUser } from '@/api/auth';
import { insertProfileIfNotExists } from '@/api/profile';
import { supabase } from '@/lib/supabase';

let authSubscription: Subscription | null = null;

type CredentialRequest = () => Promise<{ data: { user: User | null }; error: Error | null }>;

export type AuthMode = 'login' | 'signup' | 'forgot';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  isRecoveryMode: boolean;
  isAuthDialogOpen: boolean;
  authDialogMode: AuthMode;
  authRedirect: string | null;
  clearRecoveryMode: () => void;
  openAuthDialog: (mode?: AuthMode, redirect?: string) => void;
  closeAuthDialog: () => void;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  logIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<() => void>;
}

function persistedUser(): User | null {
  try {
    const key = Object.keys(localStorage).find((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
    const raw = key && localStorage.getItem(key);
    if (!raw) return null;
    const session = JSON.parse(raw.startsWith('base64-') ? atob(raw.slice(7)) : raw);
    if (!session?.user || (session.expires_at ?? 0) * 1000 < Date.now()) return null;
    return session.user;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => {
  const withCredentials = async (request: CredentialRequest) => {
    set({ isLoading: true });
    try {
      const { data, error } = await request();
      if (error) throw error;
      if (data.user) set({ user: data.user });
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      set({ isLoading: false });
    }
  };

  return {
    user: persistedUser(),
    isLoading: false,
    isInitialized: false,
    isRecoveryMode: false,
    isAuthDialogOpen: false,
    authDialogMode: 'login',
    authRedirect: null,

    clearRecoveryMode: () => set({ isRecoveryMode: false }),

    openAuthDialog: (mode = 'login', redirect) =>
      set({ isAuthDialogOpen: true, authDialogMode: mode, authRedirect: redirect ?? null }),

    closeAuthDialog: () => set({ isAuthDialogOpen: false, authRedirect: null }),

    signUp: (email, password) => withCredentials(() => supabase.auth.signUp({ email, password })),

    logIn: (email, password) => withCredentials(() => supabase.auth.signInWithPassword({ email, password })),

    signOut: async () => {
      set({ isLoading: true });
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error('Error signing out:', error);
      } finally {
        set({ user: null, isLoading: false });
      }
    },

    initialize: async () => {
      if (get().isInitialized) {
        return unsubscribe;
      }

      set({ isLoading: true });
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const freshUser = await getCurrentUser();
          set({ user: freshUser ?? session.user });
        } else {
          set({ user: null });
        }

        unsubscribe();

        const { data } = supabase.auth.onAuthStateChange((event, session) => {
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

      return unsubscribe;
    },
  };
});

function unsubscribe() {
  if (authSubscription) {
    authSubscription.unsubscribe();
    authSubscription = null;
  }
}

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
