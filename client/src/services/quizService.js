import api from './api';

export const getQuizById = async (id) => {
  const response = await api.get(`/quizzes/${id}`);
  return response.data;
};

export const submitQuizAttempt = async (id, data) => {
  const response = await api.post(`/quizzes/${id}/submit`, data);
  return response.data;
};
