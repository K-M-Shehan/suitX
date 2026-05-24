const fallbackApiBaseUrl = 'http://localhost:8080';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || fallbackApiBaseUrl).replace(/\/$/, '');
