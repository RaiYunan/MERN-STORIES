import { useEffect, useState, useCallback } from "react";

type FetchOptions = RequestInit;

export const useFetch = <T>(
  url: string | null,
  options: FetchOptions = {},
  dependencies: unknown[] = [],
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!url) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(url, options);
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        setData(responseData.data as T);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown Error";
        setError(errorMessage);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, refetchTrigger, ...dependencies]);

  return { data, loading, error, refetch };
};
