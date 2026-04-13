import { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/database.js';
import FormInput from '../components/common/FormInput.jsx';
import Button from '../components/common/Button.jsx';
import Loader from '../components/common/Loader.jsx';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!editingId && !formData.password.trim()) newErrors.password = 'Password is required';
    if (!editingId && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.role !== 'admin' && formData.role !== 'user') newErrors.role = 'Invalid role';
    return newErrors;
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
    });
    setShowForm(true);
    setFormErrors({});
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      status: 'active',
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
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
      };

      if (formData.password) {
        data.password = formData.password;
      }

      if (editingId) {
        await updateUser(editingId, data);
      } else {
        await createUser({ ...data, password: formData.password });
      }

      await fetchUsers();
      handleReset();
    } catch (err) {
      setFormErrors({ submit: err.response?.data?.error || err.message || 'Operation failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteUser(id);
      await fetchUsers();
    } catch (err) {
      setError('Failed to delete user');
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Manage Users</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">View, edit, add, and delete user accounts.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="rounded-2xl bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            + Add User
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
          <h2 className="mb-4 text-lg font-semibold">{editingId ? 'Edit User' : 'Add New User'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="Full Name"
                name="name"
                placeholder="e.g., John Doe"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                error={formErrors.name}
                disabled={submitting}
              />
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="e.g., user@example.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                error={formErrors.email}
                disabled={submitting}
              />
            </div>

            <FormInput
              label={editingId ? 'Password (Leave blank to keep current)' : 'Password'}
              name="password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              error={formErrors.password}
              disabled={submitting}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  disabled={submitting}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  disabled={submitting}
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-800"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
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
                className="flex-1 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
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
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      user.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleEdit(user)}
                      className="mr-3 text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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
