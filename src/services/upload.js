import { api } from './api';

export const uploadService = {
  async uploadSingle(file) {
    const formData = new FormData();
    formData.append('image', file);
    return api.upload('/upload', formData);
  },

  async uploadMultiple(files) {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.upload('/upload/multiple', formData);
  },

  async deleteFile(filename) {
    return api.delete(`/upload/${filename}`);
  },

  getImageUrl(path) {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    // In production, /uploads is proxied by nginx. In dev, VITE_API_URL points to backend.
    const apiUrl = import.meta.env.VITE_API_URL || '';
    if (apiUrl.startsWith('http')) {
      // Development: prepend the backend server URL
      const serverBase = apiUrl.replace(/\/api$/, '');
      return `${serverBase}${path}`;
    }
    // Production: relative path works with nginx proxy
    return path;
  }
};
