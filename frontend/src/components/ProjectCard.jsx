import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUsername } from '../utils/jwtUtils';

const ProjectCard = ({ project, onDelete }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/project/${project.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      onDelete?.(project.id);
    }
  };

  // Get user's role in the project
  const getUserRole = () => {
    const currentUsername = getCurrentUsername();
    if (!currentUsername) return null;
    
    // Check if user is the owner
    if (project.createdBy === currentUsername || project.ownerId === currentUsername) {
      return 'Owner';
    }
    
    // Check if user is the project manager
    if (project.projectManager === currentUsername) {
      return 'Manager';
    }
    
    // Check if user is a member
    if (project.memberIds && project.memberIds.includes(currentUsername)) {
      return 'Member';
    }
    
    return 'Viewer';
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const statusColors = {
      'ACTIVE': 'bg-green-100 text-green-700',
      'COMPLETED': 'bg-blue-100 text-blue-700',
      'ON_HOLD': 'bg-yellow-100 text-yellow-700',
      'CANCELLED': 'bg-red-100 text-red-700',
      'ARCHIVED': 'bg-gray-100 text-gray-700'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-700';
  };

  // Get role badge color
  const getRoleColor = (role) => {
    const roleColors = {
      'Owner': 'bg-purple-100 text-purple-700',
      'Manager': 'bg-blue-100 text-blue-700',
      'Member': 'bg-cyan-100 text-cyan-700',
      'Viewer': 'bg-gray-100 text-gray-600'
    };
    return roleColors[role] || 'bg-gray-100 text-gray-600';
  };

  // Format status text
  const formatStatus = (status) => {
    if (!status) return 'Active';
    return status.replace('_', ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const userRole = getUserRole();

  return (
    <button
      onClick={handleClick}
      className="relative bg-gray-300 rounded-lg aspect-square p-4 hover:bg-gray-400 transition-colors group flex flex-col items-center justify-center text-left"
    >
      {/* Project name */}
      <div className="flex-1 flex items-center justify-center w-full">
        <span className="text-gray-900 font-semibold text-center line-clamp-2 text-sm">
          {project.name}
        </span>
      </div>

      {/* Badges Row */}
      <div className="w-full mt-2 flex gap-1 justify-center flex-wrap">
        {/* Status Badge */}
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)} font-medium inline-block`}>
          {formatStatus(project.status)}
        </span>
        
        {/* Role Badge */}
        {userRole && (
          <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(userRole)} font-medium inline-block`}>
            {userRole}
          </span>
        )}
      </div>

      {/* Progress (if available) */}
      {project.progressPercentage !== undefined && project.progressPercentage !== null && (
        <div className="w-full mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-cyan-600 h-1.5 rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.max(0, project.progressPercentage))}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-600 mt-1 block">{Math.round(project.progressPercentage)}% complete</span>
        </div>
      )}

      {/* Delete button (shows on hover) */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
        aria-label="Delete project"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </button>
  );
};

export default ProjectCard;