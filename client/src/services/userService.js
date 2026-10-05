import api from './api';

export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/profile', profileData);
  return response.data;
};

export const getCodingProfiles = async () => {
  const response = await api.get('/coding-profiles');
  return response.data;
};

export const updateCodingProfiles = async (profileHandles) => {
  const response = await api.post('/coding-profiles/sync', profileHandles);
  return response.data;
};
