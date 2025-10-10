const API_BASE_URL = 'http://localhost:8080/api';

// Get JWT token from localStorage
const getToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
};

// Get all projects for the current user
export async function getAllProjects() {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

export async function getActiveProjects() {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/projects/active`, {
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch active projects');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching active projects:', error);
    throw error;
  }
}

export async function getProjectById(id) {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch project with id: ${id}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
}

// Create a new project - accepts full project data object
export async function createProject(projectData) {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    // Handle both old API (just name) and new API (full object)
    const requestData = typeof projectData === 'string' 
      ? { name: projectData, description: '' }
      : projectData;

    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create project');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

export async function updateProject(id, projectData) {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      const error = new Error(`Failed to update project with id: ${id}`);
      error.status = response.status;
      error.response = { status: response.status };
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

export async function deleteProject(id) {
  try {
    const token = getToken();
    const headers = {};
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: headers,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete project with id: ${id}`);
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}

// Analyze project risks with AI
export async function analyzeProjectRisks(projectId) {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/analyze-risks`, {
      method: 'POST',
      headers: headers,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Risk analysis failed:', errorText);
      throw new Error(`Failed to analyze project risks: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing project risks:', error);
    throw error;
  }
}
