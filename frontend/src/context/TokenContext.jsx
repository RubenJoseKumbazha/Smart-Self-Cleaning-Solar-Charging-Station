import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getTokenData, useToken, getNextRefreshTime } from '../services/tokens.js';

const TokenContext = createContext(null);

export function TokenProvider({ children }) {
  const [tokenData, setTokenData] = useState(null);
  const [nextRefresh, setNextRefresh] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load token data on mount
  useEffect(() => {
    const data = getTokenData();
    setTokenData(data);
    const refresh = getNextRefreshTime();
    setNextRefresh(refresh);
    setLoading(false);
  }, []);

  // Update refresh timer every minute
  useEffect(() => {
    if (!tokenData) return;

    const interval = setInterval(() => {
      const refresh = getNextRefreshTime();
      setNextRefresh(refresh);
    }, 60000);

    return () => clearInterval(interval);
  }, [tokenData]);

  const spendToken = (amount, description) => {
    try {
      const updated = useToken(amount, description);
      setTokenData(updated);
      return { success: true, data: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const refreshTokens = () => {
    const data = getTokenData();
    setTokenData(data);
    const refresh = getNextRefreshTime();
    setNextRefresh(refresh);
  };

  const value = useMemo(
    () => ({
      tokenData,
      loading,
      nextRefresh,
      spendToken,
      refreshTokens,
    }),
    [tokenData, loading, nextRefresh]
  );

  return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
}

export function useTokens() {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
}
