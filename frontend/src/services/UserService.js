const API_URL = "https://suitx-backend-production.up.railway.app/api/user";

/**
 * Get current authenticated user's profile
 */
export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch user profile");
  }

  return await res.json();
}

/**
 * Update current authenticated user's profile
 */
export async function updateCurrentUser(userData) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(`${API_URL}/me`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update user profile");
  }

  return await res.json();
}

/**
 * Get user by ID (for viewing other users' profiles)
 */
export async function getUserById(userId) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(`${API_URL}/${userId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch user");
  }

  return await res.json();
}
