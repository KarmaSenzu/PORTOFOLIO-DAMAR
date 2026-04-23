import { api } from './api';

export const projectService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.status) params.append('status', filters.status);
    if (filters.featured !== undefined) params.append('featured', filters.featured);
    const query = params.toString();
    return api.get(`/projects${query ? '?' + query : ''}`);
  },

  async getBySlug(slug) {
    return api.get(`/projects/${slug}`);
  },

  async create(projectData) {
    return api.post('/projects', projectData);
  },

  async update(id, projectData) {
    return api.put(`/projects/${id}`, projectData);
  },

  async delete(id) {
    return api.delete(`/projects/${id}`);
  },

  async reorder(orders) {
    return api.put('/projects/reorder', { orders });
  }
};
