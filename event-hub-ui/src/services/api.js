import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export const authService = {
  loginAttendee: (data) => api.post('/auth/attendee/login', data),
  loginOrganizer: (data) => api.post('/auth/organizer/login', data),
  logout: () => api.post('/auth/logout')
};

export const eventService = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  registerForEvent: (id) => api.post(`/events/${id}/register`)
};

export const organizerService = {
  getAll: () => api.get('/organizers'),
  getById: (id) => api.get(`/organizers/${id}`),
  create: (data) => api.post('/organizers', data),
  update: (id, data) => api.put(`/organizers/${id}`, data),
  delete: (id) => api.delete(`/organizers/${id}`)
};

export const attendeeService = {
  getAll: () => api.get('/attendees'),
  getById: (id) => api.get(`/attendees/${id}`),
  create: (data) => api.post('/attendees', data),
  update: (id, data) => api.put(`/attendees/${id}`, data),
  delete: (id) => api.delete(`/attendees/${id}`)
};

export default api;
