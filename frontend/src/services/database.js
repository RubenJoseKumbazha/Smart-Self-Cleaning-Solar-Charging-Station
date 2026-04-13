import axios from 'axios';

// Use environment variable or default to localhost backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// ============ BENCHES ============

export const getBenches = async () => {
  try {
    const response = await apiClient.get('/benches');
    return response.data;
  } catch (error) {
    console.error('Error fetching benches:', error);
    throw error;
  }
};

export const getBench = async (id) => {
  try {
    const response = await apiClient.get(`/benches/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching bench ${id}:`, error);
    throw error;
  }
};

export const createBench = async (benchData) => {
  try {
    const response = await apiClient.post('/benches', benchData);
    return response.data;
  } catch (error) {
    console.error('Error creating bench:', error);
    throw error;
  }
};

export const updateBench = async (id, benchData) => {
  try {
    const response = await apiClient.put(`/benches/${id}`, benchData);
    return response.data;
  } catch (error) {
    console.error(`Error updating bench ${id}:`, error);
    throw error;
  }
};

export const deleteBench = async (id) => {
  try {
    const response = await apiClient.delete(`/benches/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting bench ${id}:`, error);
    throw error;
  }
};

// ============ USERS ============

export const getUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUser = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

// ============ CONTROL ACTIONS (keep mock) ============

export const postControlAction = async (benchId, action) => {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (Math.random() < 0.08) {
    throw new Error(`Failed to execute ${action} on bench ${benchId}`);
  }

  return {
    success: true,
    action,
    benchId,
    timestamp: new Date().toISOString(),
  };
};
