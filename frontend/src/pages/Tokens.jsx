import { useTokens } from '../context/TokenContext.jsx';
import Loader from '../components/common/Loader.jsx';

export default function Tokens() {
  const { tokenData, loading, nextRefresh } = useTokens();

  if (loading || !tokenData) {
    return <Loader />;
  }

  const hasTokens = tokenData.availableTokens > 0;
  const usagePercent = (tokenData.usedTokens / tokenData.totalTokens) * 100;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Tokens</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Daily Token Allocation</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Earn 10 free tokens every day. Use them to perform advanced actions like remote device control and data exports.
        </p>
      </div>

      {/* Main Token Status Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Available Tokens */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-soft dark:border-emerald-700 dark:bg-emerald-950/30">
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Available Tokens</p>
          <p className="mt-3 text-4xl font-bold text-emerald-900 dark:text-emerald-100">{tokenData.availableTokens}</p>
          <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">Ready to use</p>
        </div>

        {/* Used Tokens */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-soft dark:border-rose-700 dark:bg-rose-950/30">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-300">Used Tokens</p>
          <p className="mt-3 text-4xl font-bold text-rose-900 dark:text-rose-100">{tokenData.usedTokens}</p>
          <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">Used today</p>
        </div>

        {/* Total Tokens */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-soft dark:border-slate-700 dark:bg-slate-950/60">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Allocated</p>
          <p className="mt-3 text-4xl font-bold text-slate-900 dark:text-slate-100">{tokenData.totalTokens}</p>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">All time</p>
        </div>
      </div>

      {/* Usage Progress */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Daily Usage</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Progress toward maximum daily tokens</p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-900 dark:bg-slate-800 dark:text-slate-100">
            {Math.round(usagePercent)}% used
          </div>
        </div>

        <div className="relative h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-600 transition-all duration-300"
            style={{ width: `${usagePercent}%` }}
          />
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Used {tokenData.usedTokens} of {tokenData.totalTokens} tokens</span>
          <span className={`font-semibold ${hasTokens ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {hasTokens ? `${tokenData.availableTokens} remaining` : 'No tokens available'}
          </span>
        </div>
      </div>

      {/* Next Refresh */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-soft dark:border-amber-700 dark:bg-amber-950/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100">Next Token Refresh</h2>
            <p className="text-sm text-amber-700 dark:text-amber-300">New tokens arrive in:</p>
          </div>
          <div className="rounded-2xl bg-amber-100 px-4 py-3 text-center dark:bg-amber-900/40">
            <p className="text-sm font-bold text-amber-900 dark:text-amber-100">
              {nextRefresh?.hoursLeft}h {nextRefresh?.minutesLeft}m
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400">until +10 tokens</p>
          </div>
        </div>
      </div>

      {/* Token Benefits */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">What Can You Do With Tokens?</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/60">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Force Cleaning</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Trigger immediate cleaning cycle (1 token)</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/60">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Device Reboot</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Restart solar bench device (2 tokens)</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/60">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm-2 11H7v2h3v3h2v-3h3v-2h-3v-3h-2v3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Maintenance Mode</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Activate maintenance mode (1 token)</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/60">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">Data Export</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Export bench data to CSV (3 tokens)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Transaction History (Last 7 Days)</h2>

        <div className="space-y-3">
          {tokenData.transactions.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-950/60 dark:text-slate-400">
              No transactions yet
            </p>
          ) : (
            tokenData.transactions
              .slice()
              .reverse()
              .map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/60">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        transaction.type === 'credit'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                      }`}
                    >
                      {transaction.type === 'credit' ? '+' : '−'}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{transaction.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-lg font-bold ${
                      transaction.type === 'credit'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {transaction.type === 'credit' ? '+' : '−'}{transaction.amount}
                  </p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
