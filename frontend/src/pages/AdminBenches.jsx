import { useEffect, useState } from 'react';
import { getBenches, createBench, updateBench, deleteBench } from '../services/database.js';
import FormInput from '../components/common/FormInput.jsx';
import Button from '../components/common/Button.jsx';
import Loader from '../components/common/Loader.jsx';

export default function AdminBenches() {
  const [benches, setBenches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bench_id: '',
    location: '',
    latitude: '',
    longitude: '',
    battery_percent: '50',
    panel_capacity: '200',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBenches();
  }, []);

  const fetchBenches = async () => {
    try {
      setLoading(true);
      const data = await getBenches();
      setBenches(data);
      setError('');
    } catch (err) {
      setError('Failed to load benches');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.bench_id.trim()) newErrors.bench_id = 'Bench ID is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.latitude.trim()) newErrors.latitude = 'Latitude is required';
    if (!formData.longitude.trim()) newErrors.longitude = 'Longitude is required';
    if (isNaN(formData.battery_percent) || formData.battery_percent < 0 || formData.battery_percent > 100) {
      newErrors.battery_percent = 'Battery must be 0-100';
    }
    return newErrors;
  };

  const handleEdit = (bench) => {
    setEditingId(bench.id);
    setFormData({
      bench_id: bench.bench_id,
      location: bench.location,
      latitude: bench.latitude.toString(),
      longitude: bench.longitude.toString(),
      battery_percent: bench.battery_percent.toString(),
      panel_capacity: bench.panel_capacity.toString(),
    });
    setShowForm(true);
    setFormErrors({});
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      bench_id: '',
      location: '',
      latitude: '',
      longitude: '',
      battery_percent: '50',
      panel_capacity: '200',
    });
    setShowForm(false);
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      const data = {
        bench_id: formData.bench_id,
        location: formData.location,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        battery_percent: parseInt(formData.battery_percent),
        panel_capacity: parseInt(formData.panel_capacity),
      };

      if (editingId) {
        await updateBench(editingId, data);
      } else {
        await createBench(data);
      }

      await fetchBenches();
      handleReset();
    } catch (err) {
      setFormErrors({ submit: err.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bench?')) return;

    try {
      await deleteBench(id);
      await fetchBenches();
    } catch (err) {
      setError('Failed to delete bench');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Manage Benches</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">View, edit, add, and delete solar benches.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-2xl bg-emerald-600 px-6 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            + Add Bench
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </div>
      )}

      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-semibold">{editingId ? 'Edit Bench' : 'Add New Bench'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="Bench ID"
                name="bench_id"
                placeholder="e.g., PARK-005"
                value={formData.bench_id}
                onChange={(e) => setFormData(prev => ({ ...prev, bench_id: e.target.value }))}
                error={formErrors.bench_id}
                disabled={submitting}
              />
              <FormInput
                label="Location"
                name="location"
                placeholder="e.g., Downtown Park"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                error={formErrors.location}
                disabled={submitting}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="Latitude"
                name="latitude"
                placeholder="e.g., 40.7128"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                error={formErrors.latitude}
                disabled={submitting}
              />
              <FormInput
                label="Longitude"
                name="longitude"
                placeholder="e.g., -74.0060"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                error={formErrors.longitude}
                disabled={submitting}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="Battery %"
                name="battery_percent"
                type="number"
                plaeholder="0-100"
                value={formData.battery_percent}
                onChange={(e) => setFormData(prev => ({ ...prev, battery_percent: e.target.value }))}
                error={formErrors.battery_percent}
                disabled={submitting}
              />
              <FormInput
                label="Panel Capacity (W)"
                name="panel_capacity"
                type="number"
                placeholder="e.g., 200"
                value={formData.panel_capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, panel_capacity: e.target.value }))}
                disabled={submitting}
              />
            </div>

            {formErrors.submit && (
              <div className="text-sm text-rose-600 dark:text-rose-400">{formErrors.submit}</div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleReset}
                disabled={submitting}
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300">Battery</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {benches.map((bench) => (
                <tr key={bench.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">{bench.bench_id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{bench.location}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      bench.battery_percent > 50
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                    }`}>
                      {bench.battery_percent}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      bench.status === 'online'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300'
                    }`}>
                      {bench.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleEdit(bench)}
                      className="mr-3 text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bench.id)}
                      className="text-rose-600 hover:underline dark:text-rose-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
