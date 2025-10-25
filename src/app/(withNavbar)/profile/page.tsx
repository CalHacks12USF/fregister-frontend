'use client';

import { useUser } from '@/hooks/useUser';

export default function ProfilePage() {
  const { user, isLoading, error } = useUser();

  if (isLoading) {
    return (
      <main style={{ padding: 24 }}>
        <p>Loading…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: 24 }}>
        <h1>My Profile</h1>
        <p>We couldn't load your profile. Please try again.</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={{ padding: 24 }}>
        <h1>My Profile</h1>
        <p>You're not signed in. <a href="/login">Sign in</a></p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>My Profile</h1>

      <section style={{ marginTop: 16 }}>
        <p><strong>Name:</strong> {user.displayName ?? user.displayName ?? '—'}</p>
        <p><strong>Email:</strong> {user.email ?? user.email ?? '—'}</p>
      </section>
    </main>
  );
}
