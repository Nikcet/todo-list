import React from 'react';
import { Alert } from '@mui/material';

interface SuccessMessageProps {
  message: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return (
    <Alert severity="success" sx={{ mb: 2 }}>
      {message}
    </Alert>
  );
};

export default SuccessMessage; 