import { useState } from 'react';
import FormInput from '../common/FormInput.jsx';
import Button from '../common/Button.jsx';

export default function AddBenchModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    benchId: '',
    location: '',
    latitude: '',
    longitude: '',
    initBattery: '75',
    panelCapacity: '200',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.benchId.trim()) newErrors.benchId = 'Bench ID is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.latitude.trim()) newErrors.latitude = 'Latitude is required';
    if (!formData.longitude.trim()) newErrors.longitude = 'Longitude is required';
    if (isNaN(formData.initBattery) || formData.initBattery < 0 || formData.initBattery > 100) {
      newErrors.initBattery = 'Battery must be between 0 and 100';
    }
    if (isNaN(formData.panelCapacity) || formData.panelCapacity < 0) {
      newErrors.panelCapacity = 'Panel capacity must be a positive number';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onAdd({
      benchId: formData.benchId,
      location: formData.location,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      battery: parseInt(formData.initBattery),
      panelCapacity: parseInt(formData.panelCapacity),
    });

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-900">
        <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">Add New Bench</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Bench ID"
            name="benchId"
            placeholder="e.g., PARK-005"
            value={formData.benchId}
            onChange={handleChange}
            error={errors.benchId}
            disabled={loading}
          />

          <FormInput
            label="Location"
            name="location"
            placeholder="e.g., Downtown Park"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            disabled={loading}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Latitude"
              name="latitude"
              placeholder="e.g., 40.7128"
              value={formData.latitude}
              onChange={handleChange}
              error={errors.latitude}
              disabled={loading}
            />
            <FormInput
              label="Longitude"
              name="longitude"
              placeholder="e.g., -74.0060"
              value={formData.longitude}
              onChange={handleChange}
              error={errors.longitude}
              disabled={loading}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="Initial Battery %"
              name="initBattery"
              type="number"
              placeholder="0-100"
              value={formData.initBattery}
              onChange={handleChange}
              error={errors.initBattery}
              disabled={loading}
            />
            <FormInput
              label="Panel Capacity (W)"
              name="panelCapacity"
              type="number"
              placeholder="e.g., 200"
              value={formData.panelCapacity}
              onChange={handleChange}
              error={errors.panelCapacity}
              disabled={loading}
            />
          </div>

          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              {loading ? 'Adding...' : 'Add Bench'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
