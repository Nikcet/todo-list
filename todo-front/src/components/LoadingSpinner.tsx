import React from 'react';
import { Box, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
  minHeight?: string | number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ minHeight = '200px' }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight={minHeight}>
      <CircularProgress />
    </Box>
  );
};

export default LoadingSpinner; 