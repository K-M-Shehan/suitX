const API_URL = "http://localhost:8080/api/projects";

// Get JWT token from localStorage
const getToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
};

// Get all projects for the current user
export async function getAllProjects() {
  const token = getToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_URL}`, {
    method: "GET",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": token
    },
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// Create a new project
export async function createProject(name, description = "") {
  const token = getToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_URL}`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ name, description }),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// Delete a project
export async function deleteProject(projectId) {
  const token = getToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_URL}/${projectId}`, {
    method: "DELETE",
    headers: { 
      "Authorization": token
    },
  });

  if (!res.ok) throw new Error(await res.text());
}

// Update a project
export async function updateProject(projectId, name, description = "", status = "ACTIVE") {
  const token = getToken();
  if (!token) throw new Error('No authentication token found');

  const res = await fetch(`${API_URL}/${projectId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ name, description, status }),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}