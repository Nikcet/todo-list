import { useState, useCallback } from 'react';

export const useSuccess = () => {
  const [success, setSuccess] = useState(false);

  const showSuccess = useCallback(() => setSuccess(true), []);
  const hideSuccess = useCallback(() => setSuccess(false), []);
  const showSuccessWithTimeout = useCallback((timeout = 3000) => {
    showSuccess();
    setTimeout(hideSuccess, timeout);
  }, [showSuccess, hideSuccess]);

  return {
    success,
    setSuccess,
    showSuccess,
    hideSuccess,
    showSuccessWithTimeout
  };
}; 