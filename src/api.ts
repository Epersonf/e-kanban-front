import axios from 'axios';

import { Constants } from './infra/constants/constants';

const API_BASE = Constants.API_URL.endsWith('/') ? `${Constants.API_URL}/` : `${Constants.API_URL}/`;

const api = axios.create({
  baseURL: API_BASE,
});

// Adiciona o token JWT (se existir)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// USERS
export const signup = (data: { email: string; password: string; name: string }) =>
  api.post('/users/auth/signup', data);

export const login = (data: { email: string; password: string }) =>
  api.post('/users/auth/login', data);

// BOARDS
export const getBoards = () => api.get('/boards/user');
export const createBoard = (data: { boards: { name: string; description: string }[] }) => api.post('/boards/user', data);
export const updateBoard = (data: { id: number; title?: string }) => api.patch('/boards/user', data);
export const deleteBoard = (id: number) => api.delete('/boards/user', { data: { id } });

// SWIMLANES (LISTAS)
export const createSwimlane = (data: { boardId: number; title: string }) => api.post('/swimlanes/user', data);
export const updateSwimlane = (data: { id: number; title?: string }) => api.patch('/swimlanes/user', data);
export const deleteSwimlane = (id: number) => api.delete('/swimlanes/user', { data: { id } });

// TASKS (CARDS)
export const createTask = (data: { swimlaneId: number; title: string; description?: string }) => api.post('/tasks/user', data);
export const updateTask = (data: { id: number; title?: string; description?: string; members?: any[] }) => api.patch('/tasks/user', data);
export const deleteTask = (id: number) => api.delete('/tasks/user', { data: { id } });

export default api;
