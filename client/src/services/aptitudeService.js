import api from './api';

export const getAptitudeQuestions = async (params = {}) => {
  const response = await api.get('/aptitude', { params });
  return response.data;
};

export const submitAptitudeAttempt = async (attemptData) => {
  const response = await api.post('/aptitude/attempt', attemptData);
  return response.data;
};

export const getAptitudeHistory = async () => {
  const response = await api.get('/aptitude/history');
  return response.data;
};

export const createAptitudeQuestion = async (data) => {
  const response = await api.post('/aptitude', data);
  return response.data;
};
