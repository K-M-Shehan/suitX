import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RiskService from '../services/RiskService';
import { getProjectById } from '../services/ProjectService';

const RiskDetailPage = () => {
  const { riskId } = useParams();
  const navigate = useNavigate();
  const [risk, setRisk] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    status: '',
    severity: '',
    type: '',
    likelihood: '',
    assignedTo: ''
  });

  useEffect(() => {
    loadRiskDetails();
  }, [riskId]);

  const loadRiskDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch risk details
      const riskData = await RiskService.getRiskById(riskId);
      setRisk(riskData);
      
      // Initialize edit form
      setEditForm({
        title: riskData.title || '',
        description: riskData.description || '',
        status: riskData.status || '',
        severity: riskData.severity || '',
        type: riskData.type || '',
        likelihood: riskData.likelihood || '',
        assignedTo: riskData.assignedTo || ''
      });
      
      // Fetch associated project if projectId exists
      if (riskData.projectId) {
        try {
          const projectData = await getProjectById(riskData.projectId);
          setProject(projectData);
        } catch (projectError) {
          console.error('Failed to load project:', projectError);
          // Continue even if project fails to load
        }
      }
      
      setLoading(false);
    } catch (e) {
      console.error('Failed to load risk:', e);
      setError('Failed to load risk details. The risk may not exist or you may not have access.');
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to current risk data
      setEditForm({
        title: risk.title || '',
        description: risk.description || '',
        status: risk.status || '',
        severity: risk.severity || '',
        type: risk.type || '',
        likelihood: risk.likelihood || '',
        assignedTo: risk.assignedTo || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const updatedRisk = await RiskService.updateRisk(riskId, editForm);
      setRisk(updatedRisk);
      setIsEditing(false);
      setError('');
    } catch (e) {
      console.error('Failed to update risk:', e);
      alert('Failed to update risk. Please try again.');
    }
  };

  const handleResolveRisk = async () => {
    if (!window.confirm('Are you sure you want to mark this risk as resolved?')) {
      return;
    }
    
    try {
      const updatedRisk = await RiskService.updateRisk(riskId, {
        ...editForm,
        status: 'RESOLVED'
      });
      setRisk(updatedRisk);
      setEditForm(prev => ({ ...prev, status: 'RESOLVED' }));
      setError('');
    } catch (e) {
      console.error('Failed to resolve risk:', e);
      alert('Failed to resolve risk. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'OPEN': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800 border-blue-300',
      'RESOLVED': 'bg-green-100 text-green-800 border-green-300',
      'CLOSED': 'bg-gray-100 text-gray-800 border-gray-300',
      'IGNORED': 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'HIGH': 'bg-red-100 text-red-800 border-red-300',
      'MEDIUM': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'LOW': 'bg-green-100 text-green-800 border-green-300',
    };
    return colors[severity] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getLikelihoodColor = (likelihood) => {
    const colors = {
      'CERTAIN': 'bg-red-100 text-red-800 border-red-300',
      'LIKELY': 'bg-orange-100 text-orange-800 border-orange-300',
      'POSSIBLE': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'UNLIKELY': 'bg-blue-100 text-blue-800 border-blue-300',
      'RARE': 'bg-green-100 text-green-800 border-green-300',
    };
    return colors[likelihood] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading risk details...</p>
        </div>
      </div>
    );
  }

  if (error || !risk) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error || 'Risk not found'}</span>
        </div>
        <button
          onClick={() => navigate('/risks')}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Back to Risk Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/risks')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Risk Dashboard
        </button>
        
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditing ? (
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                ) : (
                  risk.title
                )}
              </h1>
              {risk.aiGenerated && (
                <span className="px-3 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-800 border border-purple-300">
                  🤖 AI Generated
                </span>
              )}
            </div>
            <div className="flex items-center mt-2 space-x-3">
              {isEditing ? (
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleInputChange}
                  className="px-3 py-1 border border-gray-300 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="IGNORED">IGNORED</option>
                </select>
              ) : (
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(risk.status)}`}>
                  {risk.status}
                </span>
              )}
              {risk.riskScore && (
                <span className="px-3 py-1 rounded-md text-sm font-bold bg-gray-800 text-white">
                  Risk Score: {risk.riskScore}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isEditing && risk.status !== 'RESOLVED' && (
              <button
                onClick={handleResolveRisk}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                ✓ Resolve Risk
              </button>
            )}
            <button
              onClick={isEditing ? handleSaveEdit : handleEditToggle}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Edit Risk'}
            </button>
            {isEditing && (
              <button
                onClick={handleEditToggle}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Associated Project */}
        {project && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Associated Project</p>
                <p className="text-lg font-semibold text-blue-700">{project.name}</p>
              </div>
              <button
                onClick={() => navigate(`/projects/${project.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                View Project →
              </button>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
          {isEditing ? (
            <textarea
              name="description"
              value={editForm.description}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          ) : (
            <p className="text-gray-700 whitespace-pre-wrap">
              {risk.description || 'No description provided.'}
            </p>
          )}
        </div>

        {/* Risk Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Type</h3>
            {isEditing ? (
              <select
                name="type"
                value={editForm.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select Type</option>
                <option value="TECHNICAL">Technical</option>
                <option value="RESOURCE">Resource</option>
                <option value="SCHEDULE">Schedule</option>
                <option value="FINANCIAL">Financial</option>
                <option value="SCOPE">Scope</option>
                <option value="QUALITY">Quality</option>
                <option value="EXTERNAL">External</option>
                <option value="OPERATIONAL">Operational</option>
              </select>
            ) : (
              <p className="text-lg font-semibold text-gray-900">{risk.type || 'N/A'}</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Severity</h3>
            {isEditing ? (
              <select
                name="severity"
                value={editForm.severity}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select Severity</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            ) : (
              <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium border ${getSeverityColor(risk.severity)}`}>
                {risk.severity || 'Unknown'}
              </span>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Likelihood</h3>
            {isEditing ? (
              <select
                name="likelihood"
                value={editForm.likelihood}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select Likelihood</option>
                <option value="RARE">Rare</option>
                <option value="UNLIKELY">Unlikely</option>
                <option value="POSSIBLE">Possible</option>
                <option value="LIKELY">Likely</option>
                <option value="CERTAIN">Certain</option>
              </select>
            ) : (
              <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium border ${getLikelihoodColor(risk.likelihood)}`}>
                {risk.likelihood || 'N/A'}
              </span>
            )}
          </div>
        </div>

        {/* Assignment */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Assignment</h2>
          {isEditing ? (
            <input
              type="text"
              name="assignedTo"
              value={editForm.assignedTo}
              onChange={handleInputChange}
              placeholder="Assigned to (user ID)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          ) : (
            <p className="text-gray-700">
              {risk.assignedTo ? `Assigned to: ${risk.assignedTo}` : 'Not assigned'}
            </p>
          )}
        </div>

        {/* AI Details */}
        {risk.aiGenerated && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-purple-900 mb-3">AI Analysis Details</h2>
            <div className="space-y-2">
              {risk.aiConfidence && (
                <div>
                  <p className="text-sm font-medium text-purple-700">Confidence Score</p>
                  <p className="text-lg font-semibold text-purple-900">{risk.aiConfidence}%</p>
                </div>
              )}
              {risk.mitigationSuggestions && risk.mitigationSuggestions.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-purple-700 mb-2">AI Suggested Mitigations</p>
                  <ul className="list-disc list-inside space-y-1">
                    {risk.mitigationSuggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-purple-800">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {risk.createdAt && (
              <div>
                <span className="font-medium text-gray-500">Created:</span>
                <span className="ml-2 text-gray-700">{formatDate(risk.createdAt)}</span>
              </div>
            )}
            {risk.updatedAt && (
              <div>
                <span className="font-medium text-gray-500">Last Updated:</span>
                <span className="ml-2 text-gray-700">{formatDate(risk.updatedAt)}</span>
              </div>
            )}
            {risk.resolvedAt && (
              <div>
                <span className="font-medium text-gray-500">Resolved:</span>
                <span className="ml-2 text-gray-700">{formatDate(risk.resolvedAt)}</span>
              </div>
            )}
            {risk.identifiedDate && (
              <div>
                <span className="font-medium text-gray-500">Identified:</span>
                <span className="ml-2 text-gray-700">{formatDate(risk.identifiedDate)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskDetailPage;
