import React, { useState } from 'react';
import ProjectFormDialog from './ProjectFormDialog';

const AddProjectCard = ({ onAddProject }) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = (projectData) => {
    onAddProject?.(projectData);
    setShowDialog(false);
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="bg-gray-300 rounded-lg aspect-square p-4 hover:bg-gray-400 transition-colors flex items-center justify-center group"
      >
        <svg 
          className="w-12 h-12 text-gray-600 group-hover:text-gray-700 transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {showDialog && (
        <ProjectFormDialog
          onSubmit={handleSubmit}
          onClose={() => setShowDialog(false)}
        />
      )}
    </>
  );
};

export default AddProjectCard;