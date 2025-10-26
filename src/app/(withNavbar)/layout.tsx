'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Spinner from '@/components/Spinner';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login
    if (mounted && !isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router, mounted]);

  // Show spinner during SSR and initial client hydration to avoid mismatch
  if (!mounted || isLoading) {
    return <Spinner fullPage />;
  }

  // If there's a user, show the navbar and the page content
  if (user) {
    return (
      <div className="bg-bgMain h-screen w-screen flex">
        <Sidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  // If no user and not loading (before redirect kicks in), render nothing
  return null;
}