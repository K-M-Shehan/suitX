import { isTokenExpired, handleTokenExpiration } from './jwtUtils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Enhanced fetch wrapper with automatic token expiration handling
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} - Fetch response
 */
export async function apiClient(url, options = {}) {
  // Check token expiration before making the request
  const token = localStorage.getItem('token');
  if (token && isTokenExpired(token)) {
    console.warn('Token expired, redirecting to login...');
    handleTokenExpiration();
    return Promise.reject(new Error('Token expired'));
  }

  // Add authorization header if token exists
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);

    // Handle 401 Unauthorized (expired or invalid token)
    if (response.status === 401) {
      console.warn('Received 401 Unauthorized, token may be expired');
      handleTokenExpiration();
      throw new Error('Unauthorized - please log in again');
    }

    return response;
  } catch (error) {
    // Network errors or other issues
    if (error.message.includes('Unauthorized')) {
      throw error;
    }
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * GET request helper
 */
export async function apiGet(url) {
  const response = await apiClient(url, { method: 'GET' });
  if (!response.ok) {
    throw new Error(`GET ${url} failed: ${response.statusText}`);
  }
  return await response.json();
}

/**
 * POST request helper
 */
export async function apiPost(url, data) {
  const response = await apiClient(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `POST ${url} failed: ${response.statusText}`);
  }
  // Handle different response types
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}

/**
 * PUT request helper
 */
export async function apiPut(url, data) {
  const response = await apiClient(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `PUT ${url} failed: ${response.statusText}`);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}

/**
 * PATCH request helper
 */
export async function apiPatch(url, data) {
  const response = await apiClient(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `PATCH ${url} failed: ${response.statusText}`);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}

/**
 * DELETE request helper
 */
export async function apiDelete(url) {
  const response = await apiClient(url, { method: 'DELETE' });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `DELETE ${url} failed: ${response.statusText}`);
  }
  // DELETE might return empty response
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export { API_BASE_URL };
