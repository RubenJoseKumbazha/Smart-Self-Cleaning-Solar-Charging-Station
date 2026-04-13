import { useLastUpdated } from '../components/layout/UpdateContext.jsx';
import Button from '../components/common/Button.jsx';

export default function Settings() {
  const { theme, themeKey, setThemeKey, availableThemes, darkMode } = useLastUpdated();

  const handleThemeChange = (key) => {
    setThemeKey(key);
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Customization</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Personalize your dashboard with color themes. Your preferences are saved automatically.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Color Themes</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Choose a color theme that matches your preference. The theme will be applied globally across the dashboard.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(availableThemes).map(([key, colorTheme]) => (
            <button
              key={key}
              onClick={() => handleThemeChange(key)}
              className={`relative rounded-3xl border-2 p-6 text-left transition ${
                themeKey === key
                  ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-200 dark:border-slate-100 dark:bg-slate-800 dark:ring-slate-600'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600'
              }`}
            >
              {themeKey === key && (
                <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-100">
                  <svg className="h-4 w-4 text-white dark:text-slate-950" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{colorTheme.name}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-lg shadow-soft"
                    style={{ backgroundColor: colorTheme.primary }}
                    title="Primary Color"
                  />
                  <div
                    className="h-8 w-8 rounded-lg shadow-soft"
                    style={{ backgroundColor: colorTheme.accent }}
                    title="Accent Color"
                  />
                  <div
                    className="h-8 w-8 rounded-lg shadow-soft"
                    style={{ backgroundColor: colorTheme.success }}
                    title="Success Color"
                  />
                  <div
                    className="h-8 w-8 rounded-lg shadow-soft"
                    style={{ backgroundColor: colorTheme.warning }}
                    title="Warning Color"
                  />
                  <div
                    className="h-8 w-8 rounded-lg shadow-soft"
                    style={{ backgroundColor: colorTheme.danger }}
                    title="Danger Color"
                  />
                </div>

                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950/60">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-medium">Primary:</span> {colorTheme.primary}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-medium">Accent:</span> {colorTheme.accent}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Current Theme Preview</h2>

        <div className="space-y-4">
          <div className="rounded-2xl p-4" style={{ backgroundColor: theme.primary }}>
            <p className="text-sm font-medium text-white">Primary Color</p>
            <p className="text-xs text-white/80">{theme.primary}</p>
          </div>

          <div className="rounded-2xl p-4" style={{ backgroundColor: theme.accent }}>
            <p className="text-sm font-medium text-white">Accent Color</p>
            <p className="text-xs text-white/80">{theme.accent}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl p-4" style={{ backgroundColor: theme.success }}>
              <p className="text-sm font-medium text-white">Success</p>
              <p className="text-xs text-white/80">{theme.success}</p>
            </div>
            <div className="rounded-2xl p-4" style={{ backgroundColor: theme.warning }}>
              <p className="text-sm font-medium text-white">Warning</p>
              <p className="text-xs text-white/80">{theme.warning}</p>
            </div>
            <div className="rounded-2xl p-4" style={{ backgroundColor: theme.danger }}>
              <p className="text-sm font-medium text-white">Danger</p>
              <p className="text-xs text-white/80">{theme.danger}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Theme Information</h2>

        <dl className="space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60">
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Selected Theme</dt>
            <dd className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{theme.name}</dd>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60">
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Available Themes</dt>
            <dd className="mt-1 text-base text-slate-900 dark:text-slate-100">
              {Object.keys(availableThemes).length} color themes available
            </dd>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60">
            <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Persistence</dt>
            <dd className="mt-1 text-sm text-slate-700 dark:text-slate-300">Your color theme preference is saved in the browser and will be restored on refresh.</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
