import api from './api';

export const getSavedJobs = async () => {
  const response = await api.get('/saved');
  return response.data;
};

export const createSavedJob = async (data) => {
  const response = await api.post('/saved', data);
  return response.data;
};

export const updateSavedJob = async (id, data) => {
  const response = await api.put(`/saved/${id}`, data);
  return response.data;
};

export const deleteSavedJob = async (id) => {
  const response = await api.delete(`/saved/${id}`);
  return response.data;
};

export const convertSavedJobToApplication = async (id) => {
  const response = await api.post(`/saved/${id}/apply`);
  return response.data;
};
