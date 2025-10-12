import React, { useState, useEffect } from 'react';
import MitigationService from '../services/MitigationService';
import { getAllProjects } from '../services/ProjectService';
import AIAssistant from '../components/AIAssistant';

const MitigationPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [mitigationSummary, setMitigationSummary] = useState({
    totalMitigations: 0,
    activeMitigations: 0
  });
  const [mitigations, setMitigations] = useState([]);
  const [projects, setProjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all projects to get project names
        try {
          const projectsData = await getAllProjects();
          const projectMap = {};
          if (Array.isArray(projectsData)) {
            projectsData.forEach(project => {
              projectMap[project.id] = project.name;
            });
          }
          setProjects(projectMap);
        } catch (err) {
          console.warn('Projects data not available:', err.message);
        }
        
        // Try to fetch mitigation summary
        try {
          const summary = await MitigationService.getMitigationSummary();
          setMitigationSummary({
            totalMitigations: summary.totalMitigations || 0,
            activeMitigations: summary.activeMitigations || 0
          });
        } catch (err) {
          console.warn('Mitigation summary not available:', err.message);
          // Use default values if API fails
        }

        // Try to fetch mitigations
        try {
          const mitigationsData = await MitigationService.getAllMitigations();
          setMitigations(Array.isArray(mitigationsData) ? mitigationsData : []);
        } catch (err) {
          console.warn('Mitigations data not available:', err.message);
          setMitigations([]);
        }

      } catch (error) {
        console.error('Error fetching mitigation data:', error);
        setError('Unable to load mitigation data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMitigations = selectedStatus === 'All' 
    ? mitigations 
    : mitigations.filter(mitigation => mitigation.status?.toUpperCase() === selectedStatus.toUpperCase());

  const handleMarkComplete = async (mitigationId) => {
    try {
      await MitigationService.markAsCompleted(mitigationId);
      // Refresh mitigations data
      const updatedMitigations = await MitigationService.getAllMitigations();
      setMitigations(Array.isArray(updatedMitigations) ? updatedMitigations : []);
      
      // Refresh summary
      const summary = await MitigationService.getMitigationSummary();
      setMitigationSummary({
        totalMitigations: summary.totalMitigations || 0,
        activeMitigations: summary.activeMitigations || 0
      });
    } catch (error) {
      console.error('Error marking mitigation as completed:', error);
      setError('Failed to update mitigation status.');
    }
  };

  const handleDeleteMitigation = async (mitigationId) => {
    if (!window.confirm('Are you sure you want to delete this mitigation?')) {
      return;
    }
    
    try {
      await MitigationService.deleteMitigation(mitigationId);
      // Refresh mitigations data
      const updatedMitigations = await MitigationService.getAllMitigations();
      setMitigations(Array.isArray(updatedMitigations) ? updatedMitigations : []);
      
      // Refresh summary
      const summary = await MitigationService.getMitigationSummary();
      setMitigationSummary({
        totalMitigations: summary.totalMitigations || 0,
        activeMitigations: summary.activeMitigations || 0
      });
    } catch (error) {
      console.error('Error deleting mitigation:', error);
      setError('Failed to delete mitigation.');
    }
  };

  const handleAIResults = (aiResults) => {
    console.log('AI Analysis Results:', aiResults);
    // You can process AI results here, e.g., convert to mitigations
    if (aiResults.suggestedMitigations && aiResults.suggestedMitigations.length > 0) {
      // Show success message or integrate with your mitigation creation flow
      alert(`AI generated ${aiResults.suggestedMitigations.length} mitigation strategies!`);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading mitigation data...</div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'IN_PROGRESS':
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PLANNED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'text-red-700 bg-red-100 border border-red-200';
      case 'HIGH':
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'MEDIUM':
      case 'Medium':
        return 'text-orange-600 bg-orange-50';
      case 'LOW':
      case 'Low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getEffectivenessColor = (effectiveness) => {
    switch (effectiveness) {
      case 'HIGH':
        return 'text-green-700 bg-green-100 border border-green-200';
      case 'MEDIUM':
        return 'text-yellow-700 bg-yellow-100 border border-yellow-200';
      case 'LOW':
        return 'text-orange-700 bg-orange-100 border border-orange-200';
      default:
        return 'text-gray-700 bg-gray-100 border border-gray-200';
    }
  };

  const getCardBackgroundColor = (index) => {
    const colors = [
      'bg-purple-100 border-purple-200',
      'bg-blue-100 border-blue-200',
      'bg-green-100 border-green-200',
      'bg-yellow-100 border-yellow-200',
      'bg-pink-100 border-pink-200'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-semibold text-gray-900">Mitigations</h1>
        </div>

        {/* Status Filter */}
        <div className="flex space-x-2">
          {['All', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {status === 'IN_PROGRESS' ? 'In Progress' : status.charAt(0) + status.slice(1).toLowerCase()}
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

      {/* Mitigation Summary Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Mitigation Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div className="bg-black rounded-lg p-6 text-white">
            <div className="flex flex-col items-center">
              <div className="text-6xl font-bold mb-2">{mitigationSummary.totalMitigations}</div>
              <div className="text-lg font-medium">Total Mitigations</div>
            </div>
          </div>
          <div className="bg-black rounded-lg p-6 text-white">
            <div className="flex flex-col items-center">
              <div className="text-6xl font-bold mb-2">{mitigationSummary.activeMitigations}</div>
              <div className="text-lg font-medium">Active Mitigations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mitigations Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Mitigation Strategies</h2>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowAIAssistant(true)}
              className="px-4 py-2 bg-white border-2 border-black text-black rounded-md hover:bg-gray-50 transition-colors text-sm font-medium flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>AI Assistant</span>
            </button>
            <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
              + Add New Mitigation
            </button>
          </div>
        </div>
        
        {filteredMitigations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMitigations.map((mitigation, index) => (
              <div key={mitigation.id || index} className={`rounded-lg p-6 shadow-sm border ${getCardBackgroundColor(index)}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{mitigation.title || 'Untitled Mitigation'}</h3>
                      {mitigation.aiGenerated && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          AI Generated
                        </span>
                      )}
                    </div>
                    {/* Project Tag */}
                    {mitigation.projectId && (
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          {mitigation.projectName || projects[mitigation.projectId] || 'Unknown Project'}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(mitigation.status)}`}>
                    {mitigation.status || 'Unknown'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{mitigation.description || 'No description available'}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Priority:</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(mitigation.priority)}`}>
                      {mitigation.priority || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Assignee:</span>
                    <span className="font-medium text-gray-900">{mitigation.assigneeUsername || mitigation.assignee || 'Unassigned'}</span>
                  </div>
                  {mitigation.progressPercentage !== null && mitigation.progressPercentage !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Progress:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${mitigation.progressPercentage}%` }}
                          ></div>
                        </div>
                        <span className="font-medium text-gray-900 text-xs">{mitigation.progressPercentage}%</span>
                      </div>
                    </div>
                  )}
                  {mitigation.startDate && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Start Date:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(mitigation.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Due Date:</span>
                    <span className="font-medium text-gray-900">
                      {mitigation.dueDate ? new Date(mitigation.dueDate).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>
                  {mitigation.relatedRisk && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Related Risk:</span>
                      <span className="font-medium text-gray-900 truncate max-w-[200px]" title={mitigation.relatedRisk}>
                        {mitigation.relatedRisk}
                      </span>
                    </div>
                  )}
                  {mitigation.estimatedCost && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Est. Cost:</span>
                      <span className="font-medium text-gray-900">${mitigation.estimatedCost.toLocaleString()}</span>
                    </div>
                  )}
                  {mitigation.effectiveness && mitigation.effectiveness !== 'NOT_ASSESSED' && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Effectiveness:</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getEffectivenessColor(mitigation.effectiveness)}`}>
                        {mitigation.effectiveness}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-blue-600 hover:bg-white hover:bg-opacity-50 rounded-md text-sm font-medium transition-colors">
                    Edit
                  </button>
                  <button 
                    onClick={() => handleMarkComplete(mitigation.id)}
                    className="px-3 py-1 text-green-600 hover:bg-white hover:bg-opacity-50 rounded-md text-sm font-medium transition-colors"
                    disabled={mitigation.status === 'COMPLETED'}
                  >
                    {mitigation.status === 'COMPLETED' ? 'Completed' : 'Mark Complete'}
                  </button>
                  <button 
                    onClick={() => handleDeleteMitigation(mitigation.id)}
                    className="px-3 py-1 text-red-600 hover:bg-white hover:bg-opacity-50 rounded-md text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Mitigations Found</h3>
            <p className="text-gray-600">No mitigations available for the selected status. Add some mitigations to get started!</p>
          </div>
        )}
      </div>

      {/* Quick Stats Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Critical/High Priority</h3>
              <div className="text-3xl font-bold text-red-600">
                {mitigations.filter(m => m.priority === 'HIGH' || m.priority === 'CRITICAL').length}
              </div>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Medium Priority</h3>
              <div className="text-3xl font-bold text-orange-600">
                {mitigations.filter(m => m.priority === 'MEDIUM').length}
              </div>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Completed</h3>
              <div className="text-3xl font-bold text-green-600">
                {mitigations.filter(m => m.status === 'COMPLETED').length}
              </div>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 mb-1">AI Generated</h3>
              <div className="text-3xl font-bold text-purple-600">
                {mitigations.filter(m => m.aiGenerated === true).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        onResultsGenerated={handleAIResults}
      />
    </div>
  );
};

export default MitigationPage;