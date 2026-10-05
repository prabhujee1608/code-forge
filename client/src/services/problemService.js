import api from './api';

export const getProblems = async (params = {}) => {
  const response = await api.get('/problems', { params });
  return response.data;
};

export const getProblemById = async (id) => {
  const response = await api.get(`/problems/${id}`);
  return response.data;
};

export const submitAttempt = async (attemptData) => {
  const response = await api.post('/attempts', attemptData);
  return response.data;
};

export const getAttempts = async () => {
  const response = await api.get('/attempts');
  return response.data;
};

export const createProblem = async (problemData) => {
  const response = await api.post('/problems', problemData);
  return response.data;
};

export const updateProblem = async (id, problemData) => {
  const response = await api.put(`/problems/${id}`, problemData);
  return response.data;
};

export const deleteProblem = async (id) => {
  const response = await api.delete(`/problems/${id}`);
  return response.data;
};
