'use client';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { handleLoginSuccess } = useAuth();
  
  const handleLoginError = () => {
    toast.error('Google login failed. Please try again.');
  };

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Fregister</h1>
      <p>Please sign in with Google to continue.</p>
      <div style={{ marginTop: '2rem', display: 'inline-block' }}>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />
      </div>
    </main>
  );
}