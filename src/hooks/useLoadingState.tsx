
import { useState, useCallback } from "react";

interface UseLoadingStateReturn {
  loading: boolean;
  error: string | null;
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: string | null) => void;
  withLoading: <T>(fn: () => Promise<T>) => Promise<T | null>;
}

export const useLoadingState = (): UseLoadingStateReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const withLoading = useCallback(async <T,>(fn: () => Promise<T>): Promise<T | null> => {
    startLoading();
    try {
      const result = await fn();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error in withLoading:', err);
      return null;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    loading,
    error,
    startLoading,
    stopLoading,
    setError,
    withLoading,
  };
};
