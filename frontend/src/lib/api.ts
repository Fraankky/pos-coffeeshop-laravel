import axios from 'axios';

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

const api = axios.create({
  baseURL: `${apiBaseUrl}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

function getCsrfToken(): string | null {
  const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const csrfToken = getCsrfToken();
  if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
    config.headers['X-XSRF-TOKEN'] = csrfToken;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
