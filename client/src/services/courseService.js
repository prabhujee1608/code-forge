import api from './api';

export const getCourses = async (params = {}) => {
  const response = await api.get('/courses', { params });
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

export const enrollCourse = async (id) => {
  const response = await api.post(`/courses/${id}/enroll`);
  return response.data;
};

export const getCourseProgress = async (id) => {
  const response = await api.get(`/courses/${id}/progress`);
  return response.data;
};

export const getLessonById = async (courseId, lessonId) => {
  const response = await api.get(`/courses/${courseId}/lessons/${lessonId}`);
  return response.data;
};

export const completeLesson = async (lessonId, courseId) => {
  const response = await api.post(`/lessons/${lessonId}/complete`, { courseId });
  return response.data;
};
