const API_BASE_URL = 'https://suitx-backend-production.up.railway.app/api';

// Get JWT token from localStorage
const getToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
};

class MitigationService {
  async getAllMitigations() {
    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = token;
      }

      const response = await fetch(`${API_BASE_URL}/mitigations/user`, {
        headers: headers,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch mitigations');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching mitigations:', error);
      throw error;
    }
  }

  async getMitigationsByStatus(status) {
    try {
      const response = await fetch(`${API_BASE_URL}/mitigations/status/${status}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch mitigations with status: ${status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching mitigations by status:', error);
      throw error;
    }
  }

  async getMitigationsByPriority(priority) {
    try {
      const response = await fetch(`${API_BASE_URL}/mitigations/priority/${priority}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch mitigations with priority: ${priority}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching mitigations by priority:', error);
      throw error;
    }
  }

  async getMitigationById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/mitigations/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch mitigation with id: ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching mitigation:', error);
      throw error;
    }
  }

  async createMitigation(mitigationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/mitigations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mitigationData),
      });
      if (!response.ok) {
        throw new Error('Failed to create mitigation');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating mitigation:', error);
      throw error;
    }
  }

  async updateMitigation(id, mitigationData) {
    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = token;
      }

      const response = await fetch(`${API_BASE_URL}/mitigations/${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(mitigationData),
      });
      if (!response.ok) {
        throw new Error(`Failed to update mitigation with id: ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating mitigation:', error);
      throw error;
    }
  }

  async deleteMitigation(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/mitigations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete mitigation with id: ${id}`);
      }
    } catch (error) {
      console.error('Error deleting mitigation:', error);
      throw error;
    }
  }

  async markAsCompleted(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/mitigations/${id}/complete`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error(`Failed to mark mitigation as completed with id: ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error marking mitigation as completed:', error);
      throw error;
    }
  }

  async updateProgress(id, progress) {
    try {
      const response = await fetch(`${API_BASE_URL}/mitigations/${id}/progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progress),
      });
      if (!response.ok) {
        throw new Error(`Failed to update progress for mitigation with id: ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating mitigation progress:', error);
      throw error;
    }
  }

  async getMitigationSummary() {
    try {
      const response = await fetch(`${API_BASE_URL}/mitigations/summary`);
      if (!response.ok) {
        throw new Error('Failed to fetch mitigation summary');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching mitigation summary:', error);
      throw error;
    }
  }

  async getMitigationsByProject(projectId) {
    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = token;
      }

      const response = await fetch(`${API_BASE_URL}/mitigations/project/${projectId}`, {
        headers: headers,
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch mitigations for project: ${projectId}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching mitigations by project:', error);
      throw error;
    }
  }
}

export default new MitigationService();