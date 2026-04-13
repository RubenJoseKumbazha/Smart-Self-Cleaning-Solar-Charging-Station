import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { getBenches } from '../services/api.js';
import { useLastUpdated } from '../components/layout/UpdateContext.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import BenchCard from '../components/dashboard/BenchCard.jsx';
import Loader from '../components/common/Loader.jsx';
import { formatCurrency, formatRelativeTime } from '../utils/format.js';
import AddBenchModal from '../components/control/AddBenchModal.jsx';

export default function AdminDashboard() {
  const [search, setSearch] = useState('');
  const [showAddBench, setShowAddBench] = useState(false);
  const fetchBenches = useCallback(() => getBenches(), []);
  const { data: benches, loading, error, updatedAt, refresh } = useFetch(fetchBenches, [], 300000);
  const { setLastUpdated } = useLastUpdated();

  useEffect(() => {
    if (updatedAt) {
      setLastUpdated(updatedAt);
    }
  }, [updatedAt, setLastUpdated]);

  const filteredBenches = useMemo(() => {
    if (!benches) return [];
    const term = search.trim().toLowerCase();
    return benches.filter((bench) => bench.bench_id.toLowerCase().includes(term));
  }, [benches, search]);

  const stats = useMemo(() => {
    const list = benches || [];
    const totalBenches = list.length;
    const activeBenches = list.filter((bench) => bench.status === 'online').length;
    const totalSessions = list.reduce((sum, bench) => sum + bench.daily_sessions, 0);
    const totalRevenue = list.reduce((sum, bench) => sum + bench.daily_sessions * 1.25, 0);
    return { totalBenches, activeBenches, totalSessions, totalRevenue };
  }, [benches]);

  const handleAddBench = (benchData) => {
    // In a real app, this would call an API to save the bench
    // For now, we'll just close the modal and refresh
    setShowAddBench(false);
    // Optionally refresh the list
    refresh();
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Solar Bench Fleet Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage fleet operations, monitor health, and control all devices from here.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-soft dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Last refresh</p>
            <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{formatRelativeTime(updatedAt)}</p>
          </div>
          <div className="relative">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search benches"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm shadow-soft outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Benches" value={stats.totalBenches} />
        <StatCard title="Active Benches" value={stats.activeBenches} />
        <StatCard title="Sessions Today" value={stats.totalSessions} />
        <StatCard title="Revenue Today" value={formatCurrency(stats.totalRevenue)} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Bench Fleet</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Monitor bench status, manage devices, and control operations.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddBench(true)}
              className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              + Add New Bench
            </button>
            <Link
              to="/analytics"
              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-slate-200"
            >
              View analytics
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-48 rounded-2xl bg-slate-100 p-4 dark:bg-slate-800" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-700 dark:bg-rose-950/30">
            <p className="font-semibold">Unable to load bench data.</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredBenches.map((bench) => (
              <BenchCard key={bench.bench_id} bench={bench} />
            ))}
          </div>
        )}
        {!loading && benches?.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
            <p className="font-semibold">No benches in fleet yet.</p>
            <p className="mt-1 text-sm">Create your first bench by clicking the "Add New Bench" button above.</p>
          </div>
        )}
      </section>

      {showAddBench && (
        <AddBenchModal
          onClose={() => setShowAddBench(false)}
          onAdd={handleAddBench}
        />
      )}
    </div>
  );
}
