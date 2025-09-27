import React, { useState } from 'react';

const ProjectCard = ({ project, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative bg-gray-300 rounded-lg aspect-square p-4 hover:bg-gray-400 transition-colors group">
      {/* Project content */}
      <div className="flex flex-col h-full">
        {/* Project title or content can go here */}
        <div className="flex-1 flex items-center justify-center">
          <span className="text-gray-600 font-medium">{project.name}</span>
        </div>
      </div>

      {/* Delete button (shows on hover) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(project.id);
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default ProjectCard;