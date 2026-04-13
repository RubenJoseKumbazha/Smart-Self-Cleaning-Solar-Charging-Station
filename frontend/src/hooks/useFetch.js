import { useCallback, useEffect, useRef, useState } from 'react';

export default function useFetch(fetcher, deps = [], intervalMs = 300000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const intervalRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetcher();
      setData(response);
      setUpdatedAt(Date.now());
    } catch (err) {
      setError(err?.message || 'Unable to load data');
    } finally {
      setLoading(false);
    }
  }, [fetcher, ...deps]);

  useEffect(() => {
    load();
    intervalRef.current = setInterval(load, intervalMs);
    return () => clearInterval(intervalRef.current);
  }, [load, intervalMs]);

  return {
    data,
    loading,
    error,
    refresh: load,
    updatedAt,
  };
}
