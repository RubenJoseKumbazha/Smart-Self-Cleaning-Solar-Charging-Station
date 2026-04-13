import axios from 'axios';

const http = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '' });
const useMock = !import.meta.env.VITE_API_BASE_URL;

const benches = [
  {
    bench_id: 'PARK-001',
    battery_percent: 87,
    solar_watts: 12.5,
    active_sessions: 1,
    daily_sessions: 14,
    temperature: 28,
    status: 'online',
    last_cleaning: '2026-04-13T06:00:00Z',
  },
  {
    bench_id: 'PARK-002',
    battery_percent: 62,
    solar_watts: 8.8,
    active_sessions: 2,
    daily_sessions: 9,
    temperature: 32,
    status: 'online',
    last_cleaning: '2026-04-13T03:20:00Z',
  },
  {
    bench_id: 'PARK-003',
    battery_percent: 19,
    solar_watts: 3.6,
    active_sessions: 0,
    daily_sessions: 6,
    temperature: 41,
    status: 'offline',
    last_cleaning: '2026-04-12T23:45:00Z',
  },
  {
    bench_id: 'PARK-004',
    battery_percent: 52,
    solar_watts: 15.1,
    active_sessions: 1,
    daily_sessions: 11,
    temperature: 29,
    status: 'online',
    last_cleaning: '2026-04-13T02:10:00Z',
  },
];

const generateHistory = (base, variance = 8) => {
  const now = Date.now();
  return Array.from({ length: 12 }).map((_, index) => {
    const offset = 11 - index;
    const value = Math.max(0, base + (Math.sin(index / 2) * variance + Math.random() * variance - variance / 2));
    return { time: `${offset * 5}m`, value: Number(value.toFixed(1)) };
  });
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getBenches() {
  if (!useMock) {
    const response = await http.get('/benches');
    return response.data;
  }

  await delay(500);
  return benches;
}

export async function getBench(id) {
  if (!useMock) {
    const response = await http.get(`/bench/${id}`);
    return response.data;
  }

  await delay(450);
  const bench = benches.find((entry) => entry.bench_id === id) || benches[0];
  return {
    ...bench,
    battery_history: generateHistory(bench.battery_percent, 12),
    solar_history: generateHistory(bench.solar_watts, 6),
    active_sessions: bench.active_sessions,
  };
}

export async function postControlAction(action, bench_id) {
  if (!useMock) {
    const response = await http.post(`/control/${action}`, { bench_id });
    return response.data;
  }

  await delay(700);
  const success = Math.random() > 0.08;
  if (!success) {
    throw new Error('Device communication failed. Try again in a moment.');
  }
  return {
    status: 'success',
    message: `Action ${action.replace('-', ' ')} executed for ${bench_id}`,
  };
}
