// React hooks for API integration with loading/error states

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teeApi, trancheApi } from '@/lib/api';

// Health check hook
export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await teeApi.getStatus();
      return response;
    },
    retry: 1,
    staleTime: 30000,
  });
}

// Tranche prices hook with polling
export function useTranchePrices(pollInterval = 5000) {
  return useQuery({
    queryKey: ['tranche-prices'],
    queryFn: async () => {
      const response = await trancheApi.getPrices();
      return response;
    },
    refetchInterval: pollInterval,
    staleTime: pollInterval / 2,
  });
}

// TEE protect data mutation
export function useProtectData() {
  const [progress, setProgress] = useState(0);
  
  const mutation = useMutation({
    mutationFn: async ({ data, wallet }: { data: any; wallet: string }) => {
      setProgress(10);
      const response = await teeApi.protectData(data, wallet);
      setProgress(100);
      return response;
    },
    onError: () => setProgress(0),
  });

  return {
    ...mutation,
    progress,
    protect: mutation.mutate,
    protectAsync: mutation.mutateAsync,
  };
}

// TEE job execution mutation
export function useRunTEEJob() {
  const [jobProgress, setJobProgress] = useState(0);
  const [jobStatus, setJobStatus] = useState<string>('idle');

  const mutation = useMutation({
    mutationFn: async (ipfsHash: string) => {
      setJobStatus('submitting');
      setJobProgress(5);
      const response = await teeApi.runTeeJob(ipfsHash);
      setJobStatus('completed');
      setJobProgress(100);
      return response;
    },
    onError: () => {
      setJobStatus('error');
    },
  });

  const reset = useCallback(() => {
    setJobProgress(0);
    setJobStatus('idle');
    mutation.reset();
  }, [mutation]);

  return {
    ...mutation,
    jobProgress,
    jobStatus,
    reset,
    run: mutation.mutate,
    runAsync: mutation.mutateAsync,
  };
}

// Generic API hook for custom endpoints
export function useApiRequest<T>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async (
    requestFn: () => Promise<T>
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await requestFn();
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, error, isLoading, execute, reset };
}
