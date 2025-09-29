const API_BASE_URL = 'http://localhost:8080/api';

// Get JWT token from localStorage
const getToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
};

class ProjectService {
  async getAllProjects() {
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

  async getActiveProjects() {
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

  async getProjectById(id) {
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

  async createProject(projectData) {
    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = token;
      }

      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(projectData),
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

  async updateProject(id, projectData) {
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
        throw new Error(`Failed to update project with id: ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id) {
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
}

export default new ProjectService();
