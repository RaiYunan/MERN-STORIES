import { useCallback, useEffect, useState } from "react";

type FetchOptions = RequestInit;

export const useFetch = <T>(
  url: string | null,
  options: FetchOptions = {},
  dependencies: unknown[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(url, options);
      const json = await response.json();

      if (!response.ok) {
        throw new Error(
          json?.message || `Error ${response.status}: ${response.statusText}`
        );
      }

      setData(json.data as T);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
