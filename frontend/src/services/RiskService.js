const API_BASE_URL = 'http://localhost:8080/api';

class RiskService {
  async getAllRisks() {
    try {
      const response = await fetch(`${API_BASE_URL}/risks`);
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
      const response = await fetch(`${API_BASE_URL}/risks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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
      const response = await fetch(`${API_BASE_URL}/risks/${id}/resolve`, {
        method: 'PATCH',
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
      const response = await fetch(`${API_BASE_URL}/risks/${id}/ignore`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error(`Failed to ignore risk with id: ${id}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error ignoring risk:', error);
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