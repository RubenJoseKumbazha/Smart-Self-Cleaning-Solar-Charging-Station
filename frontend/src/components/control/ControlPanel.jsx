import { useState, useEffect } from 'react';
import { postControlAction, getRelayState, setRelayState, toggleRelay } from '../../services/api.js';
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
  const [relayState, setLocalRelayState] = useState(null);
  const [loadingRelay, setLoadingRelay] = useState(false);

  // Load relay state on mount
  useEffect(() => {
    loadRelayState();
  }, []);

  const loadRelayState = async () => {
    try {
      const state = await getRelayState();
      setLocalRelayState(state);
    } catch (error) {
      console.error('Failed to load relay state:', error);
    }
  };

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

  const handleRelayToggle = async () => {
    setLoadingRelay(true);
    setToast(null);
    try {
      const response = await toggleRelay();
      setLocalRelayState(response);
      setToast({ type: 'success', message: `Relay turned ${response.state}` });
    } catch (error) {
      setToast({ type: 'error', message: error?.message || 'Failed to toggle relay' });
    } finally {
      setLoadingRelay(false);
      window.setTimeout(() => setToast(null), 3200);
    }
  };

  const handleRelaySet = async (state) => {
    setLoadingRelay(true);
    setToast(null);
    try {
      const response = await setRelayState(state);
      setLocalRelayState(response);
      setToast({ type: 'success', message: `Relay turned ${response.state}` });
    } catch (error) {
      setToast({ type: 'error', message: error?.message || 'Failed to set relay state' });
    } finally {
      setLoadingRelay(false);
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

      {/* Relay Control Section */}
      <div className="mb-6 rounded-lg border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">Relay Control</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${relayState?.state === 'ON' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Status: {relayState?.state || 'Loading...'}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={loadingRelay || loadingAction}
              onClick={() => handleRelaySet('OFF')}
              className={relayState?.state === 'OFF' ? 'ring-2 ring-slate-900 dark:ring-slate-100' : ''}
            >
              OFF
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={loadingRelay || loadingAction}
              onClick={() => handleRelaySet('ON')}
              className={relayState?.state === 'ON' ? 'ring-2 ring-slate-900 dark:ring-slate-100' : ''}
            >
              ON
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={loadingRelay || loadingAction}
              onClick={handleRelayToggle}
            >
              {loadingRelay ? 'Toggling...' : 'Toggle'}
            </Button>
          </div>
        </div>
      </div>

      {/* Bench Control Actions */}
      <div>
        <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-100">Bench Commands</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {actions.map((action) => (
            <Button
              key={action.key}
              variant="secondary"
              disabled={Boolean(loadingAction) || loadingRelay}
              onClick={() => handleAction(action.key)}
            >
              {loadingAction === action.key ? 'Processing...' : action.label}
            </Button>
          ))}
        </div>
      </div>

      {toast && (
        <div className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200' : 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-200'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
