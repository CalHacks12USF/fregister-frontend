import { CircularProgress, Box } from '@mui/material';

interface SpinnerProps {
  fullPage?: boolean;
  size?: number;
}

export default function Spinner({ fullPage = false, size = 40 }: SpinnerProps) {
  // If fullPage is true, wrap the spinner in a Box for centering.
  if (fullPage) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Otherwise, return the spinner directly with a customizable size.
  return <CircularProgress size={size} />;
}