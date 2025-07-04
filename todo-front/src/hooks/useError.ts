import { useState, useCallback } from 'react';

export const useError = () => {
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);
  const setErrorMessage = useCallback((message: string) => setError(message), []);
  const handleError = useCallback((err: unknown) => {
    const message = err instanceof Error ? err.message : 'Произошла ошибка';
    setError(message);
  }, []);

  return {
    error,
    setError,
    clearError,
    setErrorMessage,
    handleError
  };
}; 