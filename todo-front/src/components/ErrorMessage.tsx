import React from 'react';
import { Alert } from '@mui/material';

interface ErrorMessageProps {
  message: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  severity = 'error' 
}) => {
  return (
    <Alert severity={severity} sx={{ mb: 2 }}>
      {message}
    </Alert>
  );
};

export default ErrorMessage; 