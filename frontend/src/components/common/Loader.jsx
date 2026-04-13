export default function Loader() {
  return (
    <div className="mx-4 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-soft dark:border-slate-700 dark:bg-slate-900">
      <div className="inline-flex h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900 dark:border-slate-600 dark:border-t-slate-100" />
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading dashboard data...</p>
    </div>
  );
}
