import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MitigationService from '../services/MitigationService';
import { getAllProjects, getProjectById } from '../services/ProjectService';
import AIAssistant from '../components/AIAssistant';

const MitigationPage = () => {
  const navigate = useNavigate();
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
  const [editingMitigation, setEditingMitigation] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    assignee: '',
    dueDate: '',
    estimatedCost: '',
    effectiveness: ''
  });

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

  const handleEditMitigation = async (mitigation) => {
    setEditingMitigation(mitigation);
    setEditForm({
      title: mitigation.title || '',
      description: mitigation.description || '',
      status: mitigation.status || '',
      priority: mitigation.priority || '',
      assignee: mitigation.assignee || '',
      dueDate: mitigation.dueDate ? mitigation.dueDate.split('T')[0] : '',
      estimatedCost: mitigation.estimatedCost || '',
      effectiveness: mitigation.effectiveness || 'NOT_ASSESSED'
    });

    // Fetch project team members if projectId exists
    if (mitigation.projectId) {
      try {
        const projectData = await getProjectById(mitigation.projectId);
        if (projectData) {
          const token = localStorage.getItem('token');
          const allMemberIds = [];
          
          // Add owner if exists
          if (projectData.ownerId) {
            allMemberIds.push(projectData.ownerId);
          }
          
          // Add project manager if exists and different from owner
          if (projectData.projectManager && projectData.projectManager !== projectData.ownerId) {
            allMemberIds.push(projectData.projectManager);
          }
          
          // Add all other members
          if (projectData.memberIds && projectData.memberIds.length > 0) {
            projectData.memberIds.forEach(id => {
              if (!allMemberIds.includes(id)) {
                allMemberIds.push(id);
              }
            });
          }
          
          if (allMemberIds.length > 0) {
            // Fetch user details for each member ID using the correct endpoint
            const memberDetailsPromises = allMemberIds.map(async (userId) => {
              try {
                const response = await fetch(`http://localhost:8080/api/user/${userId}`, {
                  headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                  }
                });
                if (response.ok) {
                  return await response.json();
                }
                return null;
              } catch (error) {
                console.error(`Error fetching user ${userId}:`, error);
                return null;
              }
            });
            
            const members = await Promise.all(memberDetailsPromises);
            const validMembers = members.filter(m => m !== null);
            setTeamMembers(validMembers);
          } else {
            setTeamMembers([]);
          }
        } else {
          setTeamMembers([]);
        }
      } catch (error) {
        console.error('Error fetching project team members:', error);
        setTeamMembers([]);
      }
    } else {
      setTeamMembers([]);
    }
  };

  const handleSaveEdit = async () => {
    try {
      // Prepare the update data with proper field mapping
      const updateData = {
        title: editForm.title,
        description: editForm.description,
        status: editForm.status,
        priority: editForm.priority,
        assignee: editForm.assignee,
        dueDate: editForm.dueDate ? new Date(editForm.dueDate).toISOString() : null,
        estimatedCost: editForm.estimatedCost ? parseFloat(editForm.estimatedCost) : null,
        effectiveness: editForm.effectiveness
      };

      await MitigationService.updateMitigation(editingMitigation.id, updateData);
      
      // Refresh mitigations data
      const updatedMitigations = await MitigationService.getAllMitigations();
      setMitigations(Array.isArray(updatedMitigations) ? updatedMitigations : []);
      
      // Refresh summary
      try {
        const summary = await MitigationService.getMitigationSummary();
        setMitigationSummary({
          totalMitigations: summary.totalMitigations || 0,
          activeMitigations: summary.activeMitigations || 0
        });
      } catch (err) {
        console.warn('Could not refresh summary:', err);
      }
      
      // Close modal
      setEditingMitigation(null);
      setTeamMembers([]);
    } catch (error) {
      console.error('Error updating mitigation:', error);
      alert('Failed to update mitigation. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingMitigation(null);
    setTeamMembers([]);
    setEditForm({
      title: '',
      description: '',
      status: '',
      priority: '',
      assignee: '',
      dueDate: '',
      estimatedCost: '',
      effectiveness: ''
    });
  };

  const handleMitigationClick = (mitigationId) => {
    navigate(`/mitigations/${mitigationId}`);
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mitigation data...</p>
        </div>
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
    <div className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-50">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Mitigations</h1>
        </div>

        {/* Status Filter - Scrollable on mobile */}
        <div className="overflow-x-auto scrollbar-hide -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex space-x-2 min-w-max sm:min-w-0">
          {['All', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
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
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mitigation Summary Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Mitigation Summary</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-2xl">
          <div className="bg-black rounded-lg p-4 sm:p-6 text-white">
            <div className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl md:text-6xl font-bold mb-1 sm:mb-2">{mitigationSummary.totalMitigations}</div>
              <div className="text-xs sm:text-sm md:text-lg font-medium text-center">Total Mitigations</div>
            </div>
          </div>
          <div className="bg-black rounded-lg p-4 sm:p-6 text-white">
            <div className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl md:text-6xl font-bold mb-1 sm:mb-2">{mitigationSummary.activeMitigations}</div>
              <div className="text-xs sm:text-sm md:text-lg font-medium text-center">Active Mitigations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Quick Stats</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-gray-200 rounded-lg p-3 sm:p-4 md:p-6">
            <div className="text-center">
              <h3 className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1">Critical/High Priority</h3>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600">
                {mitigations.filter(m => m.priority === 'HIGH' || m.priority === 'CRITICAL').length}
              </div>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg p-3 sm:p-4 md:p-6">
            <div className="text-center">
              <h3 className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1">Medium Priority</h3>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-600">
                {mitigations.filter(m => m.priority === 'MEDIUM').length}
              </div>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg p-3 sm:p-4 md:p-6">
            <div className="text-center">
              <h3 className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1">Completed</h3>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">
                {mitigations.filter(m => m.status === 'COMPLETED').length}
              </div>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg p-3 sm:p-4 md:p-6">
            <div className="text-center">
              <h3 className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700 mb-1">AI Generated</h3>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600">
                {mitigations.filter(m => m.aiGenerated === true).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mitigations Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Mitigation Strategies</h2>
          <div className="flex space-x-2 sm:space-x-3">
            <button 
              onClick={() => setShowAIAssistant(true)}
              className="px-3 sm:px-4 py-2 bg-white border-2 border-black text-black rounded-md hover:bg-gray-50 transition-colors text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>AI Assistant</span>
            </button>
          </div>
        </div>
        
        {filteredMitigations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredMitigations.map((mitigation, index) => (
              <div 
                key={mitigation.id || index} 
                className={`rounded-lg p-4 sm:p-6 shadow-sm border ${getCardBackgroundColor(index)} hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => handleMitigationClick(mitigation.id)}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">{mitigation.title || 'Untitled Mitigation'}</h3>
                      {mitigation.aiGenerated && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 flex-shrink-0">
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
                        <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 truncate max-w-full">
                          <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          {mitigation.projectName || projects[mitigation.projectId] || 'Unknown Project'}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap flex-shrink-0 ${getStatusColor(mitigation.status)}`}>
                    {mitigation.status || 'Unknown'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed break-words">{mitigation.description || 'No description available'}</p>
                
                <div className="space-y-2 mb-3 sm:mb-4">
                  <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                    <span className="text-gray-500">Priority:</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(mitigation.priority)}`}>
                      {mitigation.priority || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                    <span className="text-gray-500">Assignee:</span>
                    <span className="font-medium text-gray-900 truncate max-w-[150px]">{mitigation.assigneeUsername || mitigation.assignee || 'Unassigned'}</span>
                  </div>
                  {mitigation.progressPercentage !== null && mitigation.progressPercentage !== undefined && (
                    <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                      <span className="text-gray-500">Progress:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-2">
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
                    <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                      <span className="text-gray-500">Start Date:</span>
                      <span className="font-medium text-gray-900 text-xs">
                        {new Date(mitigation.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                    <span className="text-gray-500">Due Date:</span>
                    <span className="font-medium text-gray-900 text-xs">
                      {mitigation.dueDate ? new Date(mitigation.dueDate).toLocaleDateString() : 'Not set'}
                    </span>
                  </div>
                  {mitigation.relatedRisk && (
                    <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                      <span className="text-gray-500 flex-shrink-0">Related Risk:</span>
                      <span className="font-medium text-gray-900 truncate max-w-[150px] sm:max-w-[200px]" title={mitigation.relatedRisk}>
                        {mitigation.relatedRisk}
                      </span>
                    </div>
                  )}
                  {mitigation.estimatedCost && (
                    <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                      <span className="text-gray-500">Est. Cost:</span>
                      <span className="font-medium text-gray-900">${mitigation.estimatedCost.toLocaleString()}</span>
                    </div>
                  )}
                  {mitigation.effectiveness && mitigation.effectiveness !== 'NOT_ASSESSED' && (
                    <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                      <span className="text-gray-500">Effectiveness:</span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getEffectivenessColor(mitigation.effectiveness)}`}>
                        {mitigation.effectiveness}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditMitigation(mitigation);
                    }}
                    className="px-3 py-1 text-blue-600 hover:bg-white hover:bg-opacity-50 rounded-md text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkComplete(mitigation.id);
                    }}
                    className="px-3 py-1 text-green-600 hover:bg-white hover:bg-opacity-50 rounded-md text-sm font-medium transition-colors"
                    disabled={mitigation.status === 'COMPLETED'}
                  >
                    {mitigation.status === 'COMPLETED' ? 'Completed' : 'Mark Complete'}
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMitigation(mitigation.id);
                    }}
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

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={showAIAssistant}
        onClose={() => setShowAIAssistant(false)}
        onResultsGenerated={handleAIResults}
      />

      {/* Edit Mitigation Modal */}
      {editingMitigation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Edit Mitigation</h2>
              
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
                    <option value="PLANNED">Planned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Priority</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                {/* Effectiveness */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effectiveness
                  </label>
                  <select
                    value={editForm.effectiveness}
                    onChange={(e) => setEditForm({ ...editForm, effectiveness: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="NOT_ASSESSED">Not Assessed</option>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                {/* Assignee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignee
                  </label>
                  {teamMembers && teamMembers.length > 0 ? (
                    <select
                      value={editForm.assignee}
                      onChange={(e) => setEditForm({ ...editForm, assignee: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Team Member</option>
                      {teamMembers.map((member, index) => (
                        <option key={member.id || index} value={member.id}>
                          {member.name || member.username || member.email}
                          {member.email && member.name ? ` (${member.email})` : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={editForm.assignee}
                      onChange={(e) => setEditForm({ ...editForm, assignee: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter assignee user ID"
                    />
                  )}
                  {editingMitigation?.projectId && teamMembers && teamMembers.length === 0 && (
                    <p className="mt-1 text-sm text-gray-500">No team members found for this project. You can manually enter a user ID.</p>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editForm.dueDate}
                    onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Estimated Cost */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Cost
                  </label>
                  <input
                    type="number"
                    value={editForm.estimatedCost}
                    onChange={(e) => setEditForm({ ...editForm, estimatedCost: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                  />
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

export default MitigationPage;