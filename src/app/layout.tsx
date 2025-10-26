'use client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    return (
      <html lang="en">
        <body>
          <h1>Error: Google Client ID is not configured.</h1>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className="">
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <Toaster position="top-right" />
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}