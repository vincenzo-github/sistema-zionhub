import { create } from 'zustand';
import { User } from '@/types';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  userId: string;
  email: string;
  full_name: string;
  role: string;
  church_id: string;
}

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
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const user: User = {
          id: decoded.userId,
          email: decoded.email,
          full_name: decoded.full_name,
          role: decoded.role,
          church_id: decoded.church_id,
        };
        set({ 
          token,
          user,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Failed to decode token:', error);
        Cookies.remove('auth_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      }
    }
  },
}));
