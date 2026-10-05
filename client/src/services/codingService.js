import api from './api';

export const getProblems = async (params = {}) => {
  const response = await api.get('/coding/problems', { params });
  return response.data;
};

export const getProblemById = async (id) => {
  const response = await api.get(`/coding/problems/${id}`);
  return response.data;
};

export const runCode = async (data) => {
  const response = await api.post('/coding/run', data);
  return response.data;
};

export const submitCode = async (data) => {
  const response = await api.post('/coding/submit', data);
  return response.data;
};
