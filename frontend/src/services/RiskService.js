const API_BASE_URL = 'http://localhost:8080/api';

// Get JWT token from localStorage
const getToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
};

class RiskService {
  async getAllRisks() {
    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = token;
      }

      const response = await fetch(`${API_BASE_URL}/risks`, {
        headers: headers,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch risks');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching risks:', error);
      throw error;
    }
  }

  async getRisksByStatus(status) {
    try {
      const response = await fetch(`${API_BASE_URL}/risks/status/${status}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch risks with status: ${status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching risks by status:', error);
      throw error;
    }
  }

  async getRiskById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/risks/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch risk with id: ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching risk:', error);
      throw error;
    }
  }

  async createRisk(riskData) {
    try {
      const response = await fetch(`${API_BASE_URL}/risks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(riskData),
      });
      if (!response.ok) {
        throw new Error('Failed to create risk');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating risk:', error);
      throw error;
    }
  }

  async updateRisk(id, riskData) {
    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = token;
      }

      const response = await fetch(`${API_BASE_URL}/risks/${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(riskData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update risk with id: ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating risk:', error);
      throw error;
    }
  }

  async deleteRisk(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/risks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete risk with id: ${id}`);
      }
    } catch (error) {
      console.error('Error deleting risk:', error);
      throw error;
    }
  }

  async resolveRisk(id) {
    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = token;
      }

      const response = await fetch(`${API_BASE_URL}/risks/${id}/resolve`, {
        method: 'PATCH',
        headers: headers,
      });
      if (!response.ok) {
        throw new Error(`Failed to resolve risk with id: ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error resolving risk:', error);
      throw error;
    }
  }

  async ignoreRisk(id) {
    try {
      const token = getToken();
      console.log('Token:', token ? 'Present' : 'Missing');
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = token;
      }

      console.log('Ignoring risk with id:', id);
      console.log('Request URL:', `${API_BASE_URL}/risks/${id}/ignore`);
      
      const response = await fetch(`${API_BASE_URL}/risks/${id}/ignore`, {
        method: 'PATCH',
        headers: headers,
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to ignore risk with id: ${id}. Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Success response:', data);
      return data;
    } catch (error) {
      console.error('Error ignoring risk:', error);
      throw error;
    }
  }

  async getRisksByProject(projectId) {
    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = token;
      }

      const response = await fetch(`${API_BASE_URL}/risks/project/${projectId}`, {
        headers: headers,
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch risks for project: ${projectId}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching risks by project:', error);
      throw error;
    }
  }

  async getRisksByProject(projectId) {
    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = token;
      }

      const response = await fetch(`${API_BASE_URL}/risks/project/${projectId}`, {
        headers: headers,
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch risks for project: ${projectId}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching risks by project:', error);
      throw error;
    }
  }

  async getRiskSummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/risks/summary`);
      if (!response.ok) {
        throw new Error('Failed to fetch risk summary');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching risk summary:', error);
      throw error;
    }
  }
}

export default new RiskService();