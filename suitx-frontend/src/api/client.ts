import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '', // if empty, frontend uses mocks
  withCredentials: false,
});

api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    // You can add global error handling/toasts here
    return Promise.reject(error);
  }
);

export default api;