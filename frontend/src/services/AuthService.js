import { API_BASE_URL } from '../utils/apiConfig';

const API_URL = `${API_BASE_URL}/auth`;

export async function signup(username, email, password) {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.text(); // "User registered!"
}

export async function login(username, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // { token: "..." }
}

export async function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const res = await fetch(`${API_BASE_URL}/api/user/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Failed to fetch current user');
  return await res.json();
}
