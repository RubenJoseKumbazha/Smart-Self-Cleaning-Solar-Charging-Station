export function formatPercent(value) {
  if (value === undefined || value === null) return '–';
  return `${Math.round(value)}%`;
}

export function formatWatts(value) {
  if (value === undefined || value === null) return '–';
  return `${Number(value).toFixed(1)} W`;
}

export function formatCurrency(value) {
  if (value === undefined || value === null) return '–';
  return `$${Number(value).toFixed(2)}`;
}

export function formatDateTime(value) {
  if (!value) return '–';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(timestamp) {
  if (!timestamp) return 'just now';
  const delta = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (delta < 60) return `${delta}s ago`;
  if (delta < 3600) return `${Math.floor(delta / 60)}m ago`;
  return `${Math.floor(delta / 3600)}h ago`;
}
