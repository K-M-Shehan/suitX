const API_URL = "https://suitx-backend-production.up.railway.app/auth";

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
  if (!token) {
    throw new Error('No token found');
  }

  const res = await fetch('https://suitx-backend-production.up.railway.app/api/user/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) throw new Error('Failed to fetch current user');
  return await res.json();
}
