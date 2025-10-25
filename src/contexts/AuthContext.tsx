'use client';
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CredentialResponse } from '@react-oauth/google';
import { LoginResponse, User } from '@/types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  handleLoginSuccess: (credentialResponse: CredentialResponse) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      toast.error('No credential received from Google.');
      return;
    }
    
    const toastId = toast.loading('Signing in...');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${idToken}` },
      });

      if (response.ok) {
        const data: LoginResponse = await response.json();

        console.log("Login response data:", data);
        
        setUser(data.user);
        setToken(idToken);

        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', idToken);

        toast.success('Successfully signed in!', { id: toastId });
        router.push('/');
      } else {
        toast.error('Backend authentication failed.', { id: toastId });
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error('Failed to connect to the backend.', { id: toastId });
    }
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
    <AuthContext.Provider value={{ user, token, isLoading, handleLoginSuccess, logout }}>
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