export default function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
      <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</dt>
      <dd className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">{value}</dd>
    </div>
  );
}
