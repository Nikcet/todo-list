import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import type { ButtonProps } from '@mui/material';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText,
  children,
  disabled,
  startIcon,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={loading || disabled}
      startIcon={loading ? <CircularProgress size={20} /> : startIcon}
    >
      {loading && loadingText ? loadingText : children}
    </Button>
  );
};

export default LoadingButton; 