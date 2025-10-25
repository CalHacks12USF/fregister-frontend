'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
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
      <div className="bg-bgMain min-h-screen flex">
        <Sidebar />
        <main className="flex-1">
          {/* <Navbar /> */}
          {children}
        </main>
      </div>
    );
  }

  // If no user and not loading (before redirect kicks in), render nothing
  return null;
}