const DAILY_TOKENS = 10;
const TOKENS_KEY = 'user_tokens_data';

export function getTokenData() {
  const stored = localStorage.getItem(TOKENS_KEY);
  if (!stored) {
    return initializeTokens();
  }

  try {
    const data = JSON.parse(stored);
    const now = new Date();
    const lastRefresh = new Date(data.lastRefresh);
    
    // Check if a day has passed
    const daysPassed = Math.floor((now - lastRefresh) / (1000 * 60 * 60 * 24));
    
    if (daysPassed > 0) {
      // Reset tokens for new day
      return resetDailyTokens(data, daysPassed);
    }
    
    return data;
  } catch {
    return initializeTokens();
  }
}

export function initializeTokens() {
  const now = new Date();
  const data = {
    totalTokens: DAILY_TOKENS,
    usedTokens: 0,
    availableTokens: DAILY_TOKENS,
    lastRefresh: now.toISOString(),
    createdAt: now.toISOString(),
    transactions: [
      {
        id: '1',
        type: 'credit',
        amount: DAILY_TOKENS,
        description: 'Daily token allocation',
        timestamp: now.toISOString(),
      },
    ],
  };

  localStorage.setItem(TOKENS_KEY, JSON.stringify(data));
  return data;
}

export function resetDailyTokens(data, daysPassed) {
  const now = new Date();
  
  // Remove old transactions (older than 7 days)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const filteredTransactions = data.transactions.filter(
    (t) => new Date(t.timestamp) > sevenDaysAgo
  );

  // Add new daily allocation
  const newTransaction = {
    id: `txn_${Date.now()}`,
    type: 'credit',
    amount: DAILY_TOKENS,
    description: 'Daily token allocation',
    timestamp: now.toISOString(),
  };

  const updatedData = {
    totalTokens: data.totalTokens + DAILY_TOKENS,
    usedTokens: data.usedTokens,
    availableTokens: data.availableTokens + DAILY_TOKENS,
    lastRefresh: now.toISOString(),
    createdAt: data.createdAt,
    transactions: [...filteredTransactions, newTransaction],
  };

  localStorage.setItem(TOKENS_KEY, JSON.stringify(updatedData));
  return updatedData;
}

export function useToken(amount, description) {
  const data = getTokenData();

  if (data.availableTokens < amount) {
    throw new Error(`Insufficient tokens. Available: ${data.availableTokens}, Required: ${amount}`);
  }

  const now = new Date();
  const transaction = {
    id: `txn_${Date.now()}`,
    type: 'debit',
    amount,
    description,
    timestamp: now.toISOString(),
  };

  const updatedData = {
    ...data,
    usedTokens: data.usedTokens + amount,
    availableTokens: data.availableTokens - amount,
    transactions: [...data.transactions, transaction],
  };

  localStorage.setItem(TOKENS_KEY, JSON.stringify(updatedData));
  return updatedData;
}

export function getNextRefreshTime() {
  const data = getTokenData();
  const lastRefresh = new Date(data.lastRefresh);
  const nextRefresh = new Date(lastRefresh.getTime() + 24 * 60 * 60 * 1000);
  const now = new Date();

  const timeUntilRefresh = nextRefresh - now;
  const hoursLeft = Math.floor(timeUntilRefresh / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeUntilRefresh % (1000 * 60 * 60)) / (1000 * 60));

  return {
    nextRefreshTime: nextRefresh,
    hoursLeft,
    minutesLeft,
    timeUntilRefresh,
  };
}
