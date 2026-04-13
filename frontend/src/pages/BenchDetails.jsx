import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch.js';
import { getBench } from '../services/api.js';
import { useLastUpdated } from '../components/layout/UpdateContext.jsx';
import { formatDateTime, formatPercent, formatWatts } from '../utils/format.js';
import BatteryChart from '../components/charts/BatteryChart.jsx';
import SolarChart from '../components/charts/SolarChart.jsx';
import ControlPanel from '../components/control/ControlPanel.jsx';
import Loader from '../components/common/Loader.jsx';

export default function BenchDetails() {
  const { id } = useParams();
  const fetchDetail = useCallback(() => getBench(id), [id]);
  const { data: bench, loading, error, updatedAt } = useFetch(fetchDetail, [id], 300000);
  const { setLastUpdated } = useLastUpdated();

  useEffect(() => {
    if (updatedAt) {
      setLastUpdated(updatedAt);
    }
  }, [updatedAt, setLastUpdated]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="m-6 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-700 dark:bg-rose-950/30">
        <h2 className="text-lg font-semibold">Failed to load bench details</h2>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Bench details</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{bench.bench_id}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Last cleaning: {formatDateTime(bench.last_cleaning)}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-soft dark:bg-slate-800 dark:text-slate-200">
            Current solar generation: {formatWatts(bench.solar_watts)}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Battery Level</p>
              <p className="mt-3 text-3xl font-semibold">{formatPercent(bench.battery_percent)}</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{bench.active_sessions} active session(s)</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm text-slate-500 dark:text-slate-400">Temperature</p>
              <p className="mt-3 text-3xl font-semibold">{bench.temperature}°C</p>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Solar output {formatWatts(bench.solar_watts)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
            <BatteryChart data={bench.battery_history} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
            <SolarChart data={bench.solar_history} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">Device snapshot</h2>
            <dl className="mt-5 grid gap-4">
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60">
                <dt className="text-sm text-slate-500 dark:text-slate-400">Bench ID</dt>
                <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">{bench.bench_id}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60">
                <dt className="text-sm text-slate-500 dark:text-slate-400">Status</dt>
                <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">{bench.status}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60">
                <dt className="text-sm text-slate-500 dark:text-slate-400">Active sessions</dt>
                <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">{bench.active_sessions}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60">
                <dt className="text-sm text-slate-500 dark:text-slate-400">Last cleaning</dt>
                <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">{formatDateTime(bench.last_cleaning)}</dd>
              </div>
            </dl>
          </div>
          <ControlPanel benchId={bench.bench_id} />
        </div>
      </div>
    </div>
  );
}
