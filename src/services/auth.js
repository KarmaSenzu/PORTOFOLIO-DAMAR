import { api } from './api';

export const authService = {
  async login(username, password) {
    const data = await api.post('/auth/login', { username, password });
    localStorage.setItem('portfolio_token', data.token);
    localStorage.setItem('portfolio_user', JSON.stringify(data.user));
    return data;
  },

  async verify() {
    const data = await api.get('/auth/verify');
    return data;
  },

  logout() {
    localStorage.removeItem('portfolio_token');
    localStorage.removeItem('portfolio_user');
  },

  isAuthenticated() {
    return !!localStorage.getItem('portfolio_token');
  },

  getUser() {
    const user = localStorage.getItem('portfolio_user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('portfolio_token');
  }
};
