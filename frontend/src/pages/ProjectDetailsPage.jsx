import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, updateProject } from '../services/ProjectService';
import { getTasksByProject, createTask, updateTask } from '../services/TaskService';
import ProjectEditDialog from '../components/ProjectEditDialog';
import TaskFormDialog from '../components/TaskFormDialog';
import TaskEditDialog from '../components/TaskEditDialog';

const ProjectDetailsPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isTaskEditDialogOpen, setIsTaskEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error || 'Project not found'}</span>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <div className="flex items-center mt-2 space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
              {project.progressPercentage !== null && (
                <span className="text-sm text-gray-600">
                  Progress: {project.progressPercentage}%
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={() => setIsEditDialogOpen(true)}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Edit Project
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'tasks', 'timeline'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {project.description || 'No description provided.'}
            </p>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Timeline</h3>
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
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Budget</h3>
                <p className="text-2xl font-bold text-gray-900">
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
          {project.memberIds && project.memberIds.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Team Members</h2>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {project.memberIds.length} member{project.memberIds.length !== 1 ? 's' : ''}
                </p>
                {/* TODO: Display actual user names when user service is available */}
              </div>
            </div>
          )}

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
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                          {task.status}
                        </span>
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
                        {task.assignedTo && (
                          <span>Assigned to: {task.assignedTo}</span>
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
      />

      <TaskEditDialog
        isOpen={isTaskEditDialogOpen}
        onClose={() => {
          setIsTaskEditDialogOpen(false);
          setSelectedTask(null);
        }}
        onSubmit={handleEditTask}
        task={selectedTask}
      />
    </div>
  );
};

export default ProjectDetailsPage;
