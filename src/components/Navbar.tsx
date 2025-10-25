'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@mui/material';
import Link from 'next/link';
import LogoutIcon from '@mui/icons-material/Logout';

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

export default function Navbar() {
  const { user, logout } = useAuth();

  return user &&(
    <div className='flex h-16 justify-between items-center text-2xl bg-bgMain px-4'>
      <Link href="/" className='text-primary font-bold'>Fregister</Link>
      <LogoutIcon onClick={logout} className='text-primary cursor-pointer' />
      <Avatar
          alt={user.name}
          src={user.avatar}
          onClick={() => {}}
          sx={{ cursor: 'pointer' }}
        />
    </div>
  );
}