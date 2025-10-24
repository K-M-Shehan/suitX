import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MitigationService from '../services/MitigationService';
import RiskService from '../services/RiskService';
import { getProjectById } from '../services/ProjectService';

const MitigationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mitigation, setMitigation] = useState(null);
  const [risk, setRisk] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [isEditingMitigation, setIsEditingMitigation] = useState(false);
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
    const fetchMitigationDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch mitigation details
        const mitigationData = await MitigationService.getMitigationById(id);
        setMitigation(mitigationData);
        setProgressValue(mitigationData.progressPercentage || 0);

        // Fetch related risk if available
        if (mitigationData.relatedRiskId) {
          try {
            const riskData = await RiskService.getRiskById(mitigationData.relatedRiskId);
            setRisk(riskData);
          } catch (err) {
            console.warn('Could not fetch related risk:', err);
          }
        }

        // Fetch project details if available
        if (mitigationData.projectId) {
          try {
            const projectData = await getProjectById(mitigationData.projectId);
            setProject(projectData);
          } catch (err) {
            console.warn('Could not fetch project details:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching mitigation details:', error);
        setError('Failed to load mitigation details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMitigationDetails();
  }, [id]);

  const handleEditMitigation = async () => {
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
            // Fetch user details for each member ID
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
    
    setIsEditingMitigation(true);
  };

  const handleSaveEdit = async () => {
    try {
      // Prepare the update data
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

      await MitigationService.updateMitigation(id, updateData);
      
      // Refresh mitigation data
      const updatedMitigation = await MitigationService.getMitigationById(id);
      setMitigation(updatedMitigation);
      
      // Close modal
      setIsEditingMitigation(false);
      setTeamMembers([]);
    } catch (error) {
      console.error('Error updating mitigation:', error);
      alert('Failed to update mitigation. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditingMitigation(false);
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

  const handleMarkComplete = async () => {
    try {
      await MitigationService.markAsCompleted(id);
      const updatedMitigation = await MitigationService.getMitigationById(id);
      setMitigation(updatedMitigation);
    } catch (error) {
      console.error('Error marking mitigation as completed:', error);
      alert('Failed to update mitigation status.');
    }
  };

  const handleUpdateProgress = async () => {
    try {
      await MitigationService.updateProgress(id, { progressPercentage: progressValue });
      const updatedMitigation = await MitigationService.getMitigationById(id);
      setMitigation(updatedMitigation);
      setIsEditingProgress(false);
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this mitigation?')) {
      return;
    }

    try {
      await MitigationService.deleteMitigation(id);
      navigate('/mitigations');
    } catch (error) {
      console.error('Error deleting mitigation:', error);
      alert('Failed to delete mitigation.');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading mitigation details...</div>
      </div>
    );
  }

  if (error || !mitigation) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error || 'Mitigation not found'}</p>
          <button
            onClick={() => navigate('/mitigations')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Back to Mitigations
          </button>
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
    switch (priority?.toUpperCase()) {
      case 'CRITICAL':
        return 'text-red-700 bg-red-100 border border-red-200';
      case 'HIGH':
        return 'text-red-600 bg-red-50 border border-red-100';
      case 'MEDIUM':
        return 'text-orange-600 bg-orange-50 border border-orange-100';
      case 'LOW':
        return 'text-green-600 bg-green-50 border border-green-100';
      default:
        return 'text-gray-600 bg-gray-50 border border-gray-100';
    }
  };

  const getEffectivenessColor = (effectiveness) => {
    switch (effectiveness?.toUpperCase()) {
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

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-50">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() => navigate('/mitigations')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Mitigations
        </button>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 break-words">{mitigation.title}</h1>
            {mitigation.aiGenerated && (
              <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200 self-start sm:self-auto flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Generated
              </span>
            )}
            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border whitespace-nowrap flex-shrink-0 ${getStatusColor(mitigation.status)}`}>
              {mitigation.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={handleEditMitigation}
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm whitespace-nowrap"
            >
              Edit Mitigation
            </button>
            <button
              onClick={handleDelete}
              className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs sm:text-sm whitespace-nowrap"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Description</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
              {mitigation.description || 'No description provided'}
            </p>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Progress</h2>
              {!isEditingProgress && (
                <button
                  onClick={() => setIsEditingProgress(true)}
                  className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium"
                >
                  Update
                </button>
              )}
            </div>
            {isEditingProgress ? (
              <div className="space-y-3 sm:space-y-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressValue}
                  onChange={(e) => setProgressValue(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">{progressValue}%</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setProgressValue(mitigation.progressPercentage || 0);
                        setIsEditingProgress(false);
                      }}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProgress}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${mitigation.progressPercentage || 0}%` }}
                  ></div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{mitigation.progressPercentage || 0}%</p>
              </div>
            )}
          </div>

          {/* Action Items */}
          {mitigation.actionItems && mitigation.actionItems.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Action Items</h2>
              <ul className="space-y-3">
                {mitigation.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={item.completed || false}
                      className="mt-1"
                      readOnly
                    />
                    <div className="flex-1">
                      <p className={`text-gray-700 ${item.completed ? 'line-through' : ''}`}>
                        {item.description}
                      </p>
                      {item.dueDate && (
                        <p className="text-sm text-gray-500">
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Links */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Links</h2>
            <div className="space-y-3">
              {/* Project Link */}
              {project && (
                <div
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Project</p>
                    <p className="font-medium text-gray-900">{project.name}</p>
                  </div>
                </div>
              )}

              {/* Risk Link */}
              {risk && (
                <div
                  onClick={() => navigate(`/risks/${risk.id}`)}
                  className="flex items-center gap-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer border border-red-200"
                >
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833-.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Related Risk</p>
                    <p className="font-medium text-gray-900">{risk.title}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Priority</p>
                <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getPriorityColor(mitigation.priority)}`}>
                  {mitigation.priority || 'Not Set'}
                </span>
              </div>

              {mitigation.effectiveness && mitigation.effectiveness !== 'NOT_ASSESSED' && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Effectiveness</p>
                  <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getEffectivenessColor(mitigation.effectiveness)}`}>
                    {mitigation.effectiveness}
                  </span>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-1">Assignee</p>
                <p className="font-medium text-gray-900">
                  {mitigation.assigneeUsername || mitigation.assignee || 'Unassigned'}
                </p>
              </div>

              {mitigation.estimatedCost && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Estimated Cost</p>
                  <p className="font-medium text-gray-900">${mitigation.estimatedCost.toLocaleString()}</p>
                </div>
              )}

              {mitigation.actualCost && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Actual Cost</p>
                  <p className="font-medium text-gray-900">${mitigation.actualCost.toLocaleString()}</p>
                </div>
              )}

              {mitigation.startDate && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Start Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(mitigation.startDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-1">Due Date</p>
                <p className="font-medium text-gray-900">
                  {mitigation.dueDate
                    ? new Date(mitigation.dueDate).toLocaleDateString()
                    : 'Not set'}
                </p>
              </div>

              {mitigation.completedAt && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Completed At</p>
                  <p className="font-medium text-gray-900">
                    {new Date(mitigation.completedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-1">Created</p>
                <p className="font-medium text-gray-900">
                  {mitigation.createdAt
                    ? new Date(mitigation.createdAt).toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {mitigation.updatedAt
                    ? new Date(mitigation.updatedAt).toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-2">
              <button
                onClick={handleMarkComplete}
                disabled={mitigation.status === 'COMPLETED'}
                className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                  mitigation.status === 'COMPLETED'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {mitigation.status === 'COMPLETED' ? 'Completed' : 'Mark as Complete'}
              </button>
              <button
                onClick={handleEditMitigation}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
              >
                Edit Mitigation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Mitigation Modal */}
      {isEditingMitigation && (
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
                  {mitigation?.projectId && teamMembers && teamMembers.length === 0 && (
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

export default MitigationDetailPage;
