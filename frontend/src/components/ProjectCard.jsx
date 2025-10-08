import React from 'react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <button
      onClick={handleClick}
      className="relative bg-gray-300 rounded-lg aspect-square p-4 hover:bg-gray-400 transition-colors group flex items-center justify-center"
    >
      {/* Project name */}
      <span className="text-gray-700 font-medium text-center line-clamp-2">
        {project.name}
      </span>

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