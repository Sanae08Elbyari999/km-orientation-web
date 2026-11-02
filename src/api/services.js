import api from './client';

export const authApi = {
  login: (data) => api.post('/login', data).then((r) => r.data),
  register: (data) => api.post('/register', data).then((r) => r.data),
  me: () => api.get('/me').then((r) => r.data),
  updateProfile: (data) => api.put('/me', data).then((r) => r.data),
  logout: () => api.post('/logout'),
};

export const programsApi = {
  list: (params) => api.get('/programs', { params }).then((r) => r.data),
  get: (id) => api.get(`/programs/${id}`).then((r) => r.data),
};

export const favoritesApi = {
  list: () => api.get('/favorites').then((r) => r.data),
  toggle: (programId) => api.post(`/favorites/${programId}`).then((r) => r.data),
};