const API_BASE_URL = 'https://suitx-backend-production.up.railway.app/api';

// Get JWT token from localStorage
const getToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
};

// AI Risk Analysis Service
export async function analyzeProjectRisks(analysisRequest) {
  try {
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_BASE_URL}/ai/analyze-risks`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(analysisRequest),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing project risks:', error);
    throw error;
  }
}

// Health check for AI service
export async function checkAIServiceHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error checking AI service health:', error);
    throw error;
  }
}

// Validate analysis request before sending
export function validateAnalysisRequest(request) {
  const errors = [];
  
  if (!request.projectName || request.projectName.trim().length === 0) {
    errors.push('Project name is required');
  }
  
  if (!request.projectDescription || request.projectDescription.trim().length === 0) {
    errors.push('Project description is required');
  }
  
  if (request.projectDescription && request.projectDescription.length < 50) {
    errors.push('Project description should be at least 50 characters for better analysis');
  }
  
  if (request.teamSize && (request.teamSize < 1 || request.teamSize > 1000)) {
    errors.push('Team size should be between 1 and 1000');
  }
  
  return errors;
}

// Create default analysis request
export function createDefaultAnalysisRequest(projectData = {}) {
  return {
    projectName: projectData.name || '',
    projectDescription: projectData.description || '',
    projectType: projectData.type || 'Software Development',
    timeline: projectData.timeline || '3-6 months',
    budget: projectData.budget || 'Medium',
    teamSize: projectData.teamSize || 5,
    technologyStack: projectData.technology || 'Web Application',
    industry: projectData.industry || 'Technology',
    specificConcerns: projectData.concerns || '',
    complexity: projectData.complexity || 'MEDIUM'
  };
}