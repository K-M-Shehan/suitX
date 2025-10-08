/**
 * Decode JWT token to get payload
 * @param {string} token - JWT token
 * @returns {object} - Decoded payload
 */
export function decodeJWT(token) {
  try {
    if (!token) return null;
    
    // Remove "Bearer " prefix if present
    const cleanToken = token.replace('Bearer ', '');
    
    // JWT has 3 parts separated by dots
    const parts = cleanToken.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Get current user's username from stored token
 * @returns {string|null} - Username or null if not found
 */
export function getCurrentUsername() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const payload = decodeJWT(token);
    return payload?.sub || null; // 'sub' is typically the username in JWT
  } catch (error) {
    console.error('Error getting current username:', error);
    return null;
  }
}

/**
 * Get current user's ID from stored token
 * @returns {string|null} - User ID or null if not found
 */
export function getCurrentUserId() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const payload = decodeJWT(token);
    return payload?.userId || payload?.id || null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
}
