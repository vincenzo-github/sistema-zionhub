import { create } from 'zustand';
import { User } from '@/types';
import Cookies from 'js-cookie';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => {
    if (token) {
      Cookies.set('auth_token', token, { expires: 7 });
    } else {
      Cookies.remove('auth_token');
    }
    set({ token });
  },
  setLoading: (isLoading) => set({ isLoading }),

  logout: () => {
    Cookies.remove('auth_token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  hydrate: () => {
    const token = Cookies.get('auth_token');
    if (token) {
      set({ token });
    }
  },
}));
