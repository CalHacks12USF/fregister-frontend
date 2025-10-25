'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Spinner from '@/components/Spinner';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // While checking for user, show a full-page spinner
  if (isLoading) {
    return <Spinner fullPage />;
  }

  // If there's a user, show the navbar and the page content
  if (user) {
    return (
      <div>
        <Navbar />
        {children}
      </div>
    );
  }

  // If no user and not loading (before redirect kicks in), render nothing
  return null;
}