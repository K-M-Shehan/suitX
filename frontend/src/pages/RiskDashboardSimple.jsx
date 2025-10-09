import React, { useState, useEffect } from 'react';
import RiskService from '../services/RiskService';
import { getAllProjects } from '../services/ProjectService';

const RiskDashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [riskSummary, setRiskSummary] = useState({
    totalProjects: 0,
    totalRisks: 0
  });
  const [risks, setRisks] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRisk, setEditingRisk] = useState(null);
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
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch risk summary
        try {
          const summary = await RiskService.getRiskSummary();
          setRiskSummary({
            totalProjects: summary.totalProjects || 0,
            totalRisks: summary.totalRisks || 0
          });
        } catch (err) {
          console.warn('Risk summary not available:', err.message);
          // Use default values if API fails
        }

        // Try to fetch risks
        try {
          const risksData = await RiskService.getAllRisks();
          setRisks(Array.isArray(risksData) ? risksData : []);
        } catch (err) {
          console.warn('Risks data not available:', err.message);
          setRisks([]);
        }

        // Try to fetch active projects
        try {
          const projectsData = await getAllProjects();
          setActiveProjects(Array.isArray(projectsData) ? projectsData.slice(0, 5) : []);
        } catch (err) {
          console.warn('Projects data not available:', err.message);
          setActiveProjects([]);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Unable to load dashboard data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRisks = selectedStatus === 'All' 
    ? risks 
    : risks.filter(risk => risk.status?.toUpperCase() === selectedStatus.toUpperCase());

  const handleEditRisk = (risk) => {
    setEditingRisk(risk);
    setEditForm({
      title: risk.title || '',
      description: risk.description || '',
      status: risk.status || '',
      severity: risk.severity || '',
      type: risk.type || '',
      likelihood: risk.likelihood || '',
      assignedTo: risk.assignedTo || ''
    });
  };

  const handleSaveEdit = async () => {
    try {
      await RiskService.updateRisk(editingRisk.id, editForm);
      // Refresh risks data
      const risksData = await RiskService.getAllRisks();
      setRisks(Array.isArray(risksData) ? risksData : []);
      
      // Refresh summary
      try {
        const summary = await RiskService.getRiskSummary();
        setRiskSummary({
          totalProjects: summary.totalProjects || 0,
          totalRisks: summary.totalRisks || 0
        });
      } catch (err) {
        console.warn('Risk summary not available:', err.message);
      }
      
      // Close modal
      setEditingRisk(null);
    } catch (error) {
      console.error('Error updating risk:', error);
      alert('Failed to update risk. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingRisk(null);
    setEditForm({
      title: '',
      description: '',
      status: '',
      severity: '',
      type: '',
      likelihood: '',
      assignedTo: ''
    });
  };

  const handleResolveRisk = async (riskId) => {
    try {
      await RiskService.resolveRisk(riskId);
      // Refresh risks data
      const risksData = await RiskService.getAllRisks();
      setRisks(Array.isArray(risksData) ? risksData : []);
      
      // Refresh summary
      try {
        const summary = await RiskService.getRiskSummary();
        setRiskSummary({
          totalProjects: summary.totalProjects || 0,
          totalRisks: summary.totalRisks || 0
        });
      } catch (err) {
        console.warn('Risk summary not available:', err.message);
      }
    } catch (error) {
      console.error('Error resolving risk:', error);
      alert('Failed to resolve risk. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'IDENTIFIED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MONITORING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'MITIGATED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ACCEPTED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'IGNORED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-red-600 bg-red-50';
      case 'HIGH':
        return 'text-orange-600 bg-orange-50';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50';
      case 'LOW':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getLikelihoodColor = (likelihood) => {
    switch (likelihood) {
      case 'CERTAIN':
        return 'text-red-600 bg-red-50';
      case 'LIKELY':
        return 'text-orange-600 bg-orange-50';
      case 'POSSIBLE':
        return 'text-yellow-600 bg-yellow-50';
      case 'UNLIKELY':
        return 'text-blue-600 bg-blue-50';
      case 'RARE':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833-.192 2.5 1.732 2.5z" />
          </svg>
          <h1 className="text-2xl font-semibold text-gray-900">Risk Dashboard</h1>
        </div>

        {/* Status Filter */}
        <div className="flex space-x-2">
          {['All', 'IDENTIFIED', 'MONITORING', 'MITIGATED', 'RESOLVED', 'ACCEPTED'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Risk Summary Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Risk Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div className="bg-black rounded-lg p-6 text-white">
            <div className="flex flex-col items-center">
              <div className="text-6xl font-bold mb-2">{riskSummary.totalProjects}</div>
              <div className="text-lg font-medium">Total Projects</div>
            </div>
          </div>
          <div className="bg-black rounded-lg p-6 text-white">
            <div className="flex flex-col items-center">
              <div className="text-6xl font-bold mb-2">{riskSummary.totalRisks}</div>
              <div className="text-lg font-medium">Total Risks</div>
            </div>
          </div>
        </div>
      </div>

      {/* Risks Section */}
      {filteredRisks.length > 0 ? (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Risk Analysis</h2>
            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
              + Add New Risk
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRisks.map((risk, index) => (
              <div key={risk.id || index} className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{risk.title || 'Untitled Risk'}</h3>
                  <div className="flex items-center space-x-2">
                    {risk.riskScore && (
                      <span className="px-2 py-1 rounded-md text-xs font-bold bg-gray-800 text-white">
                        Score: {risk.riskScore}
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(risk.status)}`}>
                      {risk.status || 'Unknown'}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{risk.description || 'No description available'}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Severity:</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getSeverityColor(risk.severity)}`}>
                      {risk.severity || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Likelihood:</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getLikelihoodColor(risk.likelihood)}`}>
                      {risk.likelihood || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium text-gray-900">{risk.type || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditRisk(risk)}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleResolveRisk(risk.id)}
                    className="px-3 py-1 text-green-600 hover:bg-green-50 rounded-md text-sm font-medium transition-colors"
                    disabled={risk.status === 'RESOLVED' || risk.status === 'Resolved'}
                  >
                    {(risk.status === 'RESOLVED' || risk.status === 'Resolved') ? 'Resolved' : 'Resolve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Risk Analysis</h2>
            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
              + Add New Risk
            </button>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Risks Found</h3>
            <p className="text-gray-600">No risks available for the selected status. Add some risks to get started!</p>
          </div>
        </div>
      )}

      {/* Active Projects Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Projects</h2>
        {activeProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map((project, index) => (
              <div key={project.id || index} className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name || 'Untitled Project'}</h3>
                <p className="text-gray-600 text-sm mb-4">{project.description || 'No description available'}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium text-green-600">{project.status || 'Active'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Projects</h3>
            <p className="text-gray-600">Create some projects to see them here.</p>
          </div>
        )}
      </div>

      {/* Edit Risk Modal */}
      {editingRisk && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit Risk</h2>
              
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="IDENTIFIED">Identified</option>
                    <option value="MONITORING">Monitoring</option>
                    <option value="MITIGATED">Mitigated</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="IGNORED">Ignored</option>
                  </select>
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity
                  </label>
                  <select
                    value={editForm.severity}
                    onChange={(e) => setEditForm({ ...editForm, severity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Severity</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Type</option>
                    <option value="TECHNICAL">Technical</option>
                    <option value="FINANCIAL">Financial</option>
                    <option value="RESOURCE">Resource</option>
                    <option value="SCOPE">Scope</option>
                    <option value="SCHEDULE">Schedule</option>
                    <option value="QUALITY">Quality</option>
                  </select>
                </div>

                {/* Likelihood */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Likelihood
                  </label>
                  <select
                    value={editForm.likelihood}
                    onChange={(e) => setEditForm({ ...editForm, likelihood: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Likelihood</option>
                    <option value="RARE">Rare</option>
                    <option value="UNLIKELY">Unlikely</option>
                    <option value="POSSIBLE">Possible</option>
                    <option value="LIKELY">Likely</option>
                    <option value="CERTAIN">Certain</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskDashboard;