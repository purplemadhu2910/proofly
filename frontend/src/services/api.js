import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem('proofly_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const signupUser = (data) => api.post('/auth/signup', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const logoutUser = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const resetPassword = (data) => api.post('/auth/reset-password', data);

// Space Endpoints
export const createSpace = (data) => api.post('/spaces', data);
export const getSpaces = () => api.get('/spaces');
export const getSpaceById = (id) => api.get(`/spaces/${id}`);
export const updateSpace = (id, data) => api.put(`/spaces/${id}`, data);
export const deleteSpace = (id) => api.delete(`/spaces/${id}`);

// Testimonial Moderation Endpoints
export const getTestimonials = (params) => api.get('/testimonials', { params });
export const getTestimonialById = (id) => api.get(`/testimonials/${id}`);
export const updateTestimonial = (id, data) => api.patch(`/testimonials/${id}`, data);
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`);
export const exportTestimonialsCsv = (spaceId) => api.get('/testimonials/export', {
  params: { spaceId },
  responseType: 'blob'
});

// Public Endpoints
export const getPublicSpace = (slug) => api.get(`/public/spaces/${slug}`);
export const submitPublicTestimonial = (slug, data) => api.post(`/public/spaces/${slug}/testimonials`, data);
export const getPublicWall = (slug, params) => api.get(`/public/spaces/${slug}/testimonials`, { params });
export const uploadPublicFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/public/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Analytics & Embed Endpoints
export const getSpaceAnalytics = (id) => api.get(`/spaces/${id}/analytics`);
export const getSpaceEmbedCode = (id, params) => api.get(`/spaces/${id}/embed`, { params });

export default api;
