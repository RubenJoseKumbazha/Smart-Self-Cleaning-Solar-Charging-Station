import { useState } from 'react';
import { postControlAction } from '../../services/api.js';
import Button from '../common/Button.jsx';

const actions = [
  { key: 'force-clean', label: 'Force Cleaning' },
  { key: 'stop-charging', label: 'Stop Charging' },
  { key: 'reboot', label: 'Reboot Device' },
  { key: 'maintenance', label: 'Maintenance Mode' },
  { key: 'update-price', label: 'Update Price' },
];

export default function ControlPanel({ benchId }) {
  const [loadingAction, setLoadingAction] = useState('');
  const [toast, setToast] = useState(null);

  const handleAction = async (action) => {
    setLoadingAction(action);
    setToast(null);
    try {
      const response = await postControlAction(action, benchId);
      setToast({ type: 'success', message: response.message || 'Command sent successfully.' });
    } catch (error) {
      setToast({ type: 'error', message: error?.message || 'Action failed' });
    } finally {
      setLoadingAction('');
      window.setTimeout(() => setToast(null), 3200);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Control panel</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Send remote commands to the selected bench.</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map((action) => (
          <Button
            key={action.key}
            variant="secondary"
            disabled={Boolean(loadingAction)}
            onClick={() => handleAction(action.key)}
          >
            {loadingAction === action.key ? 'Processing...' : action.label}
          </Button>
        ))}
      </div>
      {toast && (
        <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200' : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-200'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
