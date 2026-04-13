import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge.jsx';
import { formatPercent, formatWatts } from '../../utils/format.js';

export default function BenchCard({ bench }) {
  return (
    <Link
      to={`/bench/${bench.bench_id}`}
      className="group block rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-soft transition hover:-translate-y-1 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{bench.bench_id}</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">Bench status</h3>
        </div>
        <StatusBadge variant={bench.status}>{bench.status}</StatusBadge>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Battery</p>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{formatPercent(bench.battery_percent)}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Solar</p>
          <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{formatWatts(bench.solar_watts)}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>Active sessions: {bench.active_sessions}</span>
        <span>Daily sessions: {bench.daily_sessions}</span>
      </div>
    </Link>
  );
}
