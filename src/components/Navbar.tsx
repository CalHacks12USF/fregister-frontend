'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAuth();

  const navStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#f8f8f8',
    borderBottom: '1px solid #ddd',
  };

  const linkStyles: React.CSSProperties = {
    textDecoration: 'none',
    color: '#333',
    margin: '0 0.5rem',
  };

  const buttonStyles: React.CSSProperties = {
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: 'transparent',
  };


  return (
    <nav style={navStyles}>
      <div>
        <Link href="/" style={{...linkStyles, fontWeight: 'bold' }}>
          Fregister
        </Link>
      </div>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>
              Welcome, {user.name}!
            </span>

            <button><Link href="/profile" style={{...buttonStyles, marginRight: '0.75rem' }}>
              Profile
            </Link></button>

            <button onClick={logout} style={buttonStyles}>
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" style={linkStyles}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}