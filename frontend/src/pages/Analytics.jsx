import SessionsChart from '../components/charts/SessionsChart.jsx';
import RevenueChart from '../components/charts/RevenueChart.jsx';

const sessionData = [
  { day: 'Sun', sessions: 12, revenue: 58 },
  { day: 'Mon', sessions: 18, revenue: 72 },
  { day: 'Tue', sessions: 24, revenue: 96 },
  { day: 'Wed', sessions: 19, revenue: 80 },
  { day: 'Thu', sessions: 22, revenue: 88 },
  { day: 'Fri', sessions: 28, revenue: 112 },
  { day: 'Sat', sessions: 31, revenue: 124 },
];

export default function Analytics() {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Analytics</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Fleet performance</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Revenue and session trends for your solar charging benches. Data refreshes automatically.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Sessions per day</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Usage trend across the last week.</p>
            </div>
          </div>
          <SessionsChart data={sessionData} />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Revenue per day</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Daily earnings from bench sessions.</p>
            </div>
          </div>
          <RevenueChart data={sessionData} />
        </div>
      </div>
    </div>
  );
}
