const statusStyles = {
  online: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
  offline: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
};

export default function StatusBadge({ variant = 'online', children }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${statusStyles[variant] || statusStyles.online}`}>
      {children}
    </span>
  );
}
