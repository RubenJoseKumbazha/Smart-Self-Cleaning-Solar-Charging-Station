import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function SolarChart({ data }) {
  return (
    <div className="h-72">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Solar generation over time</h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Production values for the last reporting cycles.</p>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
          <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip wrapperStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 30px rgba(15,23,42,0.15)' }} />
          <Area type="monotone" dataKey="value" stroke="#d97706" fillOpacity={1} fill="url(#solarGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
