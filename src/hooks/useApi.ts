import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface UseApiState<T, R> {
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  data: T | null;
  isSuccess: boolean;
  reset: () => void;
  execute: (path: string, bodyData?: R) => Promise<void>;
}

const useApi = <T = unknown, R = any>(initialConfig: AxiosRequestConfig = {}): UseApiState<T, R> => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const reset = useCallback(() => {
    setIsLoading(false);
    setIsError(false);
    setError(null);
    setData(null);
    setIsSuccess(false);
  }, []);

  const execute = useCallback(
    async (path: string, bodyData?: R) => {
      reset();
      setIsLoading(true);
      try {
        const config: AxiosRequestConfig = {
          ...initialConfig,
          url: path,
          withCredentials: true,
          // baseURL: "http://localhost:3001/",
          baseURL: "",
          data: bodyData,
        };
        const response: AxiosResponse<T> = await axios(config);
        setData(response.data);
        setIsSuccess(true);
      } catch (err: any) {
        setIsError(true);
        // setError(err.response?.data?.message || err.message || 'An error occurred');
        setError(err?.response?.data);
      } finally {
        setIsLoading(false);
      }
    },
    [initialConfig, reset]
  );

  return {
    isLoading,
    isError,
    error,
    data,
    isSuccess,
    reset,
    execute,
  };
};

export default useApi;
