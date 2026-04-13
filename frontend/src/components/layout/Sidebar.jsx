import { NavLink } from 'react-router-dom';
import { useTokens } from '../../context/TokenContext.jsx';

const links = [
  { label: 'Dashboard', to: '/' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'Alerts', to: '/alerts' },
  { label: 'Tokens', to: '/tokens' },
  { label: 'Settings', to: '/settings' },
];

export default function Sidebar() {
  const { tokenData } = useTokens();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 w-full border-b border-slate-200 bg-white shadow-soft sm:static sm:w-72 sm:border-b-0 sm:border-r sm:shadow-none dark:border-slate-800 dark:bg-slate-950">
      <div className="flex h-full flex-col justify-between px-4 py-6 sm:px-6">
        <div>
          <div className="mb-8 flex items-center gap-3 rounded-3xl bg-slate-900 px-4 py-3 text-white shadow-soft dark:bg-slate-100 dark:text-slate-950">
            <div className="h-10 w-10 rounded-2xl bg-white/10"></div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-slate-300 dark:text-slate-500">Smart Bench</p>
              <p className="text-lg font-semibold">User dashboard</p>
            </div>
          </div>
          <nav className="space-y-2">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                  }`
                }
              >
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  {item.to === '/tokens' && tokenData && (
                    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">
                      {tokenData.availableTokens}
                    </span>
                  )}
                </div>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-8 rounded-3xl bg-slate-50 p-5 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          <p className="font-semibold text-slate-900 dark:text-slate-100">Fleet status</p>
          <p className="mt-2 text-sm">All benches update every 5 minutes. Manage tokens and customize your dashboard.</p>
        </div>
      </div>
    </aside>
  );
}
