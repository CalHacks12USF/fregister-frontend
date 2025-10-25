'use client';

import InputField from '@/components/InputField';
import { Container, Typography, Box } from '@mui/material';

export default function HomePage() {
  return (
    <div className="bg-bgMain flex flex-col items-center justify-center min-h-screen">
      <div className="mb-8 text-primary font-bold text-3xl">
        Where should we begin?
      </div>
      <InputField />
    </div>
  );
}