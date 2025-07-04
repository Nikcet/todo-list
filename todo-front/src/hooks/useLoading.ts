import { useState, useCallback } from 'react';

export const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);

  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);
  const withLoading = useCallback(async (fn: () => Promise<void>) => {
    try {
      startLoading();
      await fn();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    loading,
    setLoading,
    startLoading,
    stopLoading,
    withLoading
  };
}; 