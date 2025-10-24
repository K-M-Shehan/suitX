import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, updateProject, analyzeProjectRisks } from '../services/ProjectService';
import { getTasksByProject, createTask, updateTask } from '../services/TaskService';
import RiskService from '../services/RiskService';
import MitigationService from '../services/MitigationService';
import ProjectEditDialog from '../components/ProjectEditDialog';
import TaskFormDialog from '../components/TaskFormDialog';
import TaskEditDialog from '../components/TaskEditDialog';
import StatusDropdown from '../components/StatusDropdown';
import MemberManagement from '../components/MemberManagement';

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [risks, setRisks] = useState([]);
  const [mitigations, setMitigations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isTaskEditDialogOpen, setIsTaskEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [analyzingRisks, setAnalyzingRisks] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [isRiskDetailOpen, setIsRiskDetailOpen] = useState(false);

  useEffect(() => {
    loadProjectDetails();
  }, [projectId]);

  const loadProjectDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch project details
      const projectData = await getProjectById(projectId);
      setProject(projectData);
      
      // Fetch project tasks
      try {
        const tasksData = await getTasksByProject(projectId);
        setTasks(tasksData);
      } catch (taskError) {
        console.error('Failed to load tasks:', taskError);
        // Continue even if tasks fail to load
      }
      
      // Fetch project risks
      try {
        const risksData = await RiskService.getRisksByProject(projectId);
        setRisks(risksData);
      } catch (riskError) {
        console.error('Failed to load risks:', riskError);
        // Continue even if risks fail to load
      }

      // Fetch project mitigations
      try {
        const mitigationsData = await MitigationService.getMitigationsByProject(projectId);
        setMitigations(mitigationsData);
      } catch (mitigationError) {
        console.error('Failed to load mitigations:', mitigationError);
        // Continue even if mitigations fail to load
      }
      
      setLoading(false);
    } catch (e) {
      console.error('Failed to load project:', e);
      setError('Failed to load project details. You may not have access to this project.');
      setLoading(false);
    }
  };

  const handleEditProject = async (updatedProjectData) => {
    try {
      const updatedProject = await updateProject(projectId, updatedProjectData);
      setProject(updatedProject);
      setIsEditDialogOpen(false);
      setError('');
    } catch (e) {
      console.error('Failed to update project:', e);
      let errorMessage = 'Failed to update project. ';
      
      // Try to get more specific error information
      if (e.message) {
        errorMessage += e.message;
      } else if (e.response?.status === 403) {
        errorMessage += 'You may not have permission to edit this project.';
      } else if (e.response?.status === 401) {
        errorMessage += 'Your session may have expired. Please log in again.';
      } else if (e.response?.status === 404) {
        errorMessage += 'Project not found.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks((prev) => [...prev, newTask]);
      setIsTaskDialogOpen(false);
      setError('');
      
      // Refresh project data to get updated progress
      try {
        const updatedProject = await getProjectById(projectId);
        setProject(updatedProject);
      } catch (refreshError) {
        console.error('Failed to refresh project data:', refreshError);
        // Continue even if refresh fails
      }
    } catch (e) {
      console.error('Failed to create task:', e);
      alert('Failed to create task. Please try again.');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskEditDialogOpen(true);
  };

  const handleEditTask = async (updatedTaskData) => {
    try {
      const updatedTask = await updateTask(selectedTask.id, updatedTaskData);
      // Update the task in the tasks array
      setTasks((prev) => prev.map(t => t.id === selectedTask.id ? updatedTask : t));
      setIsTaskEditDialogOpen(false);
      setSelectedTask(null);
      setError('');
      
      // Refresh project data to get updated progress
      try {
        const updatedProject = await getProjectById(projectId);
        setProject(updatedProject);
      } catch (refreshError) {
        console.error('Failed to refresh project data:', refreshError);
        // Continue even if refresh fails
      }
    } catch (e) {
      console.error('Failed to update task:', e);
      let errorMessage = 'Failed to update task. ';
      
      if (e.response?.status === 403) {
        errorMessage += 'You may not have permission to edit this task.';
      } else if (e.response?.status === 401) {
        errorMessage += 'Your session may have expired. Please log in again.';
      } else if (e.response?.status === 404) {
        errorMessage += 'Task not found.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
    }
  };

  const handleAnalyzeRisks = async () => {
    try {
      setAnalyzingRisks(true);
      setError('');
      
      const risks = await analyzeProjectRisks(projectId);
      
      // Reload risks to show the new ones
      const updatedRisks = await RiskService.getRisksByProject(projectId);
      setRisks(updatedRisks);
      
      // Show success message
      alert(`Successfully generated ${risks.length} risks for this project! Check the Risks tab.`);
      
      // Switch to risks tab
      setActiveTab('risks');
      
      setAnalyzingRisks(false);
    } catch (e) {
      console.error('Failed to analyze project risks:', e);
      setError('Failed to analyze project risks. Please try again.');
      setAnalyzingRisks(false);
    }
  };

  const handleViewRiskDetails = (risk) => {
    setSelectedRisk(risk);
    setIsRiskDetailOpen(true);
  };

  const handleCloseRiskDetail = () => {
    setIsRiskDetailOpen(false);
    setSelectedRisk(null);
  };

  const handleQuickStatusUpdate = async (taskId, newStatus) => {
    try {
      // Find the task to get its current data
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // Update only the status field
      const updatedTaskData = {
        ...task,
        status: newStatus
      };

      const updatedTask = await updateTask(taskId, updatedTaskData);
      
      // Update the task in the tasks array
      setTasks((prev) => prev.map(t => t.id === taskId ? updatedTask : t));
      setError('');
      
      // Refresh project data to get updated progress
      try {
        const updatedProject = await getProjectById(projectId);
        setProject(updatedProject);
      } catch (refreshError) {
        console.error('Failed to refresh project data:', refreshError);
        // Continue even if refresh fails
      }
    } catch (e) {
      console.error('Failed to update task status:', e);
      let errorMessage = 'Failed to update task status. ';
      
      if (e.response?.status === 403) {
        errorMessage += 'You may not have permission to edit this task.';
      } else if (e.response?.status === 401) {
        errorMessage += 'Your session may have expired. Please log in again.';
      } else {
        errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'COMPLETED': 'bg-blue-100 text-blue-800',
      'ON_HOLD': 'bg-yellow-100 text-yellow-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'ARCHIVED': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'CRITICAL': 'text-red-600',
      'HIGH': 'text-orange-600',
      'MEDIUM': 'text-yellow-600',
      'LOW': 'text-green-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  const getTaskStatusColor = (status) => {
    const colors = {
      'TODO': 'bg-gray-100 text-gray-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'DONE': 'bg-green-100 text-green-800',
      'BLOCKED': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm sm:text-base">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error || 'Project not found'}</span>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
        >
          ← Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8 bg-gray-50">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 transition-colors text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{project.name}</h1>
            <div className="flex flex-wrap items-center mt-2 gap-2 sm:gap-3">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              {project.progressPercentage !== null && (
                <span className="text-xs sm:text-sm text-gray-600">
                  Progress: {project.progressPercentage}%
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleAnalyzeRisks}
              disabled={analyzingRisks}
              className={`px-3 sm:px-4 py-2 rounded-lg border-2 transition-colors text-sm sm:text-base ${
                analyzingRisks 
                  ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
                  : 'bg-white border-black text-black hover:bg-gray-50'
              }`}
            >
              {analyzingRisks ? 'Analyzing...' : 'Analyze Risks'}
            </button>
            <button
              onClick={() => setIsEditDialogOpen(true)}
              className="px-3 sm:px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              Edit Project
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
        <nav className="-mb-px flex space-x-4 sm:space-x-8">
          {['overview', 'tasks', 'team', 'risks', 'mitigations', 'timeline'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'risks' && risks.length > 0 && (
                <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full">
                  {risks.length}
                </span>
              )}
              {tab === 'mitigations' && mitigations.length > 0 && (
                <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                  {mitigations.length}
                </span>
              )}
              {tab === 'team' && (
                <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {(project?.memberIds?.length || 0) + 1}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-4 sm:space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Description</h2>
            <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap break-words">
              {project.description || 'No description provided.'}
            </p>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Timeline */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 sm:mb-3">Timeline</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(project.startDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">End Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(project.endDate)}</p>
                </div>
              </div>
            </div>

            {/* Budget */}
            {project.budget !== null && (
              <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 sm:mb-3">Budget</h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                  ${project.budget?.toLocaleString() || '0'}
                </p>
              </div>
            )}

            {/* Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Statistics</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Total Tasks</p>
                  <p className="text-sm font-medium text-gray-900">{tasks.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completed Tasks</p>
                  <p className="text-sm font-medium text-gray-900">
                    {tasks.filter(t => t.status === 'DONE').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Members */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Team Members</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {(project?.memberIds?.length || 0) + 1} member{(project?.memberIds?.length || 0) + 1 !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-gray-500">
                Click on the Team tab to view and manage members
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Metadata</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Created By</p>
                <p className="font-medium text-gray-900">{project.createdBy || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-gray-500">Created At</p>
                <p className="font-medium text-gray-900">{formatDate(project.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="font-medium text-gray-900">{formatDate(project.updatedAt)}</p>
              </div>
              {project.projectManager && (
                <div>
                  <p className="text-gray-500">Project Manager</p>
                  <p className="font-medium text-gray-900">{project.projectManager}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Tasks ({tasks.length})</h2>
            <button 
              onClick={() => setIsTaskDialogOpen(true)}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              + Add Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No tasks yet. Create your first task!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => handleTaskClick(task)}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        <StatusDropdown
                          currentStatus={task.status}
                          onStatusChange={(newStatus) => handleQuickStatusUpdate(task.id, newStatus)}
                        />
                        {task.priority && (
                          <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {task.dueDate && (
                          <span>Due: {formatDate(task.dueDate)}</span>
                        )}
                        {task.assignedToUsername && (
                          <span>Assigned to: {task.assignedToUsername}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Timeline</h2>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-medium text-gray-700">{project.progressPercentage || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-black h-3 rounded-full transition-all duration-300"
                style={{ width: `${project.progressPercentage || 0}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              {tasks.filter(t => t.status === 'DONE').length} of {tasks.length} tasks completed
            </div>
          </div>

          {/* Task Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-xs text-green-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-700">
                {tasks.filter(t => t.status === 'DONE').length}
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs text-blue-600 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-blue-700">
                {tasks.filter(t => t.status === 'IN_PROGRESS').length}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">To Do</p>
              <p className="text-2xl font-bold text-gray-700">
                {tasks.filter(t => t.status === 'TODO').length}
              </p>
            </div>
          </div>

          {/* Timeline Events */}
          <div className="space-y-4">
            {project.startDate && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Project Started</p>
                  <p className="text-xs text-gray-500">{formatDate(project.startDate)}</p>
                </div>
              </div>
            )}
            
            {project.endDate && (
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  project.status === 'COMPLETED' ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {project.status === 'COMPLETED' ? 'Project Completed' : 'Target End Date'}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(project.endDate)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Team Management
              <span className="ml-3 text-sm font-normal text-gray-500">
                ({(project?.memberIds?.length || 0) + 1} {(project?.memberIds?.length || 0) + 1 === 1 ? 'member' : 'members'})
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage project team members and send invitations to collaborate
            </p>
          </div>

          {/* Member Management Component */}
          <MemberManagement projectId={projectId} project={project} />
        </div>
      )}

      {/* Risks Tab */}
      {activeTab === 'risks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Project Risks
              {risks.length > 0 && (
                <span className="ml-3 text-sm font-normal text-gray-500">
                  ({risks.length} {risks.length === 1 ? 'risk' : 'risks'} identified)
                </span>
              )}
            </h2>
          </div>

          {risks.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Risks Identified</h3>
              <p className="text-gray-500 mb-4">
                This project doesn't have any identified risks yet.
              </p>
              <p className="text-sm text-gray-400">
                Use the "Analyze Risks" button above to automatically identify potential risks using AI.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {risks.map((risk) => (
                <div
                  key={risk.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
                  onClick={() => handleViewRiskDetails(risk)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {risk.title || 'Untitled Risk'}
                        </h3>
                        {risk.aiGenerated && (
                          <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 border border-purple-300">
                            AI
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
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

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {risk.description || 'No description available'}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
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
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Click to view more details →
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mitigations Tab */}
      {activeTab === 'mitigations' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Risk Mitigations
              {mitigations.length > 0 && (
                <span className="ml-3 text-sm font-normal text-gray-500">
                  ({mitigations.length} {mitigations.length === 1 ? 'mitigation' : 'mitigations'})
                </span>
              )}
            </h2>
          </div>

          {mitigations.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No mitigations yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create mitigation strategies for project risks in the Mitigations page
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/mitigations')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
                >
                  Go to Mitigations
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mitigations.map((mitigation) => (
                <div
                  key={mitigation.id}
                  onClick={() => navigate(`/mitigations/${mitigation.id}`)}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200 p-5"
                >
                  {/* Mitigation Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2">
                      {mitigation.title}
                    </h3>
                    {mitigation.aiGenerated && (
                      <span className="flex-shrink-0 px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        AI
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {mitigation.description || 'No description provided.'}
                  </p>

                  {/* Status and Priority */}
                  <div className="flex gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      mitigation.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      mitigation.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      mitigation.status === 'PLANNED' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {mitigation.status || 'PLANNED'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      mitigation.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      mitigation.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                      mitigation.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {mitigation.priority || 'MEDIUM'}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  {mitigation.progress !== null && mitigation.progress !== undefined && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{mitigation.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            mitigation.progress === 100 ? 'bg-green-500' :
                            mitigation.progress >= 75 ? 'bg-blue-500' :
                            mitigation.progress >= 50 ? 'bg-yellow-500' :
                            'bg-orange-500'
                          }`}
                          style={{ width: `${mitigation.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Related Risk */}
                  {mitigation.riskId && (
                    <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                      <span className="font-medium">Related to:</span> {mitigation.riskTitle || 'Risk #' + mitigation.riskId.substring(0, 8)}
                    </div>
                  )}

                  {/* Assignee */}
                  {mitigation.assigneeUsername && (
                    <div className="text-xs text-gray-500 mt-2">
                      <span className="font-medium">Assigned to:</span> {mitigation.assigneeUsername}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Dialogs */}
      <ProjectEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEditProject}
        project={project}
      />

      <TaskFormDialog
        isOpen={isTaskDialogOpen}
        onClose={() => setIsTaskDialogOpen(false)}
        onSubmit={handleAddTask}
        projectId={projectId}
        project={project}
      />

      <TaskEditDialog
        isOpen={isTaskEditDialogOpen}
        onClose={() => {
          setIsTaskEditDialogOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleEditTask}
        task={selectedTask}
        project={project}
      />

      {/* Risk Detail Modal */}
      {isRiskDetailOpen && selectedRisk && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">{selectedRisk.title}</h2>
                {selectedRisk.aiGenerated && (
                  <span className="px-3 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-800 border border-purple-300">
                    🤖 AI Generated
                  </span>
                )}
              </div>
              <button
                onClick={handleCloseRiskDetail}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status and Score */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRisk.status)}`}>
                    {selectedRisk.status}
                  </span>
                </div>
                {selectedRisk.riskScore && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Risk Score:</span>
                    <span className="px-3 py-1 rounded-md text-sm font-bold bg-gray-800 text-white">
                      {selectedRisk.riskScore}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedRisk.description || 'No description available'}
                </p>
              </div>

              {/* Risk Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Type</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedRisk.type || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Severity</p>
                  <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getSeverityColor(selectedRisk.severity)}`}>
                    {selectedRisk.severity || 'Unknown'}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Likelihood</p>
                  <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium ${getLikelihoodColor(selectedRisk.likelihood)}`}>
                    {selectedRisk.likelihood || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {selectedRisk.createdAt && (
                  <div>
                    <span className="font-medium text-gray-500">Created:</span>
                    <span className="ml-2 text-gray-700">{formatDate(selectedRisk.createdAt)}</span>
                  </div>
                )}
                {selectedRisk.updatedAt && (
                  <div>
                    <span className="font-medium text-gray-500">Last Updated:</span>
                    <span className="ml-2 text-gray-700">{formatDate(selectedRisk.updatedAt)}</span>
                  </div>
                )}
                {selectedRisk.resolvedAt && (
                  <div>
                    <span className="font-medium text-gray-500">Resolved:</span>
                    <span className="ml-2 text-gray-700">{formatDate(selectedRisk.resolvedAt)}</span>
                  </div>
                )}
                {selectedRisk.assignedToUsername && (
                  <div>
                    <span className="font-medium text-gray-500">Assigned To:</span>
                    <span className="ml-2 text-gray-700">{selectedRisk.assignedToUsername}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCloseRiskDetail}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleCloseRiskDetail();
                    navigate(`/risks/${selectedRisk.id}`);
                  }}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailsPage;
