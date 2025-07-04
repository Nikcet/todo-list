import React from 'react';
import { Alert } from '@mui/material';

interface InfoMessageProps {
  message: string;
}

const InfoMessage: React.FC<InfoMessageProps> = ({ message }) => {
  return (
    <Alert severity="info">
      {message}
    </Alert>
  );
};

export default InfoMessage; 