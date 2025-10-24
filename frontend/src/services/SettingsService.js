const API_URL = "https://suitx-backend-production.up.railway.app/api/settings";

/**
 * Get all user settings
 */
export async function getSettings() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(`${API_URL}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch settings");
  }

  return await res.json();
}

/**
 * Update all user settings
 */
export async function updateSettings(settings) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(`${API_URL}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update settings");
  }

  return await res.json();
}

/**
 * Get notification settings
 */
export async function getNotificationSettings() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const res = await fetch(`${API_URL}/notifications`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch notification settings");
  return await res.json();
}

/**
 * Update notification settings
 */
export async function updateNotificationSettings(notifications) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const res = await fetch(`${API_URL}/notifications`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notifications),
  });

  if (!res.ok) throw new Error("Failed to update notification settings");
  return await res.json();
}

/**
 * Get privacy settings
 */
export async function getPrivacySettings() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const res = await fetch(`${API_URL}/privacy`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch privacy settings");
  return await res.json();
}

/**
 * Update privacy settings
 */
export async function updatePrivacySettings(privacy) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const res = await fetch(`${API_URL}/privacy`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(privacy),
  });

  if (!res.ok) throw new Error("Failed to update privacy settings");
  return await res.json();
}

/**
 * Get theme settings
 */
export async function getThemeSettings() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const res = await fetch(`${API_URL}/theme`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch theme settings");
  return await res.json();
}

/**
 * Update theme settings
 */
export async function updateThemeSettings(theme) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const res = await fetch(`${API_URL}/theme`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(theme),
  });

  if (!res.ok) throw new Error("Failed to update theme settings");
  return await res.json();
}

/**
 * Get security settings
 */
export async function getSecuritySettings() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const res = await fetch(`${API_URL}/security`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch security settings");
  return await res.json();
}

/**
 * Update security settings
 */
export async function updateSecuritySettings(security) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found");

  const res = await fetch(`${API_URL}/security`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(security),
  });

  if (!res.ok) throw new Error("Failed to update security settings");
  return await res.json();
}

/**
 * Change user password
 */
export async function changePassword(passwordData) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  const res = await fetch(`${API_URL}/password`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(passwordData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to change password");
  }

  return await res.json();
}
