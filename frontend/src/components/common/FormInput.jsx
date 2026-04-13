export default function FormInput({ label, id, type = 'text', placeholder, value, onChange, error, disabled }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition ${
          error
            ? 'border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-rose-700 dark:bg-slate-900 dark:focus:ring-rose-900'
            : 'border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:focus:border-slate-500 dark:focus:ring-slate-800'
        } disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-100`}
      />
      {error && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
