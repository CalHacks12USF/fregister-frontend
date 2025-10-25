'use client';

import { Container, Typography, Box } from '@mui/material';

export default function HomePage() {
  return (
    <Container component="main" maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Fregister, Your AI in the Shade
      </Typography>
      
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Chat window goes here
        </Typography>
      </Box>
    </Container>
  );
}