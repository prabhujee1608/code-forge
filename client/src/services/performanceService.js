import api from './api';

export const getPerformanceOverview = async () => {
  const response = await api.get('/performance/overview');
  return response.data;
};

export const logStudySession = async (sessionData) => {
  const response = await api.post('/performance/log-session', sessionData);
  return response.data;
};
