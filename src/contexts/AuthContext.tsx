'use client';
import { createContext, useState, useContext, ReactNode } from 'react';
import { CredentialResponse } from '@react-oauth/google';
import { LoginResponse, User } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  handleLoginSuccess: (credentialResponse: CredentialResponse) => Promise<void>;
  devBypassLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  });

  const [isLoading] = useState(false);
  const router = useRouter();

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      toast.error('No credential received from Google.');
      return;
    }
    
    const toastId = toast.loading('Signing in...');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${idToken}` },
      });

      if (response.ok) {
        const data: LoginResponse = await response.json();

        console.log("Login response data:", data);
        console.log("Access token received:", data.accessToken);

        // Use the Supabase session token from backend
        const supabaseToken = data.accessToken;
        if (!supabaseToken) {
          toast.error('No access token received from backend.', { id: toastId });
          console.error('Backend response missing accessToken:', data);
          return;
        }

        setUser(data.user);
        setToken(supabaseToken);

        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', supabaseToken);

        toast.success('Successfully signed in!', { id: toastId });
        
        // Redirect based on isNewUser flag
        if (data.isNewUser) {
          router.push('/complete-signup');
        } else {
          router.push('/');
        }
      } else {
        const errorData = await response.text();
        console.error('Backend authentication failed:', errorData);
        toast.error('Backend authentication failed.', { id: toastId });
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error('Failed to connect to the backend.', { id: toastId });
    }
  };

  const devBypassLogin = () => {
    // Only allow in development mode
    if (process.env.NODE_ENV !== 'development') {
      console.warn('Dev bypass only available in development mode');
      return;
    }

    const mockUser: User = {
      id: 'dev-user-123',
      email: 'dev@fregister.local',
      name: 'Dev User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DevUser',
    };

    const mockToken = 'dev-bypass-token-' + Date.now();

    setUser(mockUser);
    setToken(mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', mockToken);

    toast.success('Dev bypass login successful!');
    router.push('/');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully.');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, handleLoginSuccess, devBypassLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}