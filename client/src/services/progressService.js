import api from './api';

export const getOverallProgress = async () => {
  const response = await api.get('/progress');
  return response.data;
};

export const getDSAProgress = async () => {
  const response = await api.get('/progress/dsa');
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/progress/analytics');
  return response.data;
};

export const getRoadmap = async () => {
  const response = await api.get('/roadmaps');
  return response.data;
};

export const updateRoadmapPhase = async (phaseData) => {
  const response = await api.put('/roadmaps/phase', phaseData);
  return response.data;
};

export const getLeaderboard = async () => {
  const response = await api.get('/leaderboard/leaderboard');
  return response.data;
};

export const getAchievements = async () => {
  const response = await api.get('/leaderboard/achievements');
  return response.data;
};

export const getBookmarks = async () => {
  const response = await api.get('/bookmarks');
  return response.data;
};

export const addBookmark = async (data) => {
  const response = await api.post('/bookmarks', data);
  return response.data;
};

export const deleteBookmark = async (id) => {
  const response = await api.delete(`/bookmarks/${id}`);
  return response.data;
};

export const getNotes = async () => {
  const response = await api.get('/notes');
  return response.data;
};

export const createNote = async (data) => {
  const response = await api.post('/notes', data);
  return response.data;
};

export const updateNote = async (id, data) => {
  const response = await api.put(`/notes/${id}`, data);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};
