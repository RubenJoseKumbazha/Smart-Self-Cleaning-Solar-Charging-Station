import StatusBadge from '../components/common/StatusBadge.jsx';

const alerts = [
  {
    id: 'alert-001',
    type: 'Low battery',
    bench_id: 'PARK-003',
    timestamp: '2026-04-13T08:14:00Z',
    status: 'warning',
    message: 'Battery level dropped below 20% and bench is offline.',
  },
  {
    id: 'alert-002',
    type: 'Offline bench',
    bench_id: 'PARK-005',
    timestamp: '2026-04-13T07:55:00Z',
    status: 'offline',
    message: 'Bench did not report data in the last 15 minutes.',
  },
  {
    id: 'alert-003',
    type: 'High temperature',
    bench_id: 'PARK-002',
    timestamp: '2026-04-13T07:12:00Z',
    status: 'warning',
    message: 'Temperature crossed safe threshold and requires inspection.',
  },
];

export default function Alerts() {
  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Alerts</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Active notifications</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Review the latest bench events and take remote action from the device panel.
        </p>
      </div>

      <div className="grid gap-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{alert.type}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{alert.message}</p>
              </div>
              <StatusBadge variant={alert.status}>{alert.status}</StatusBadge>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span>Bench: {alert.bench_id}</span>
              <span>Timestamp: {new Date(alert.timestamp).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
