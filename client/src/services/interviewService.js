import api from './api';

export const getInterviewQuestions = async (params = {}) => {
  const response = await api.get('/interviews', { params });
  return response.data;
};

export const saveUserAnswer = async (id, answerData) => {
  const response = await api.post(`/interviews/${id}/answer`, answerData);
  return response.data;
};

export const createInterviewQuestion = async (data) => {
  const response = await api.post('/interviews', data);
  return response.data;
};

export const updateInterviewQuestion = async (id, data) => {
  const response = await api.put(`/interviews/${id}`, data);
  return response.data;
};

export const deleteInterviewQuestion = async (id) => {
  const response = await api.delete(`/interviews/${id}`);
  return response.data;
};
