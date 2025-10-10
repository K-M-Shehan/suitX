import React, { useState } from 'react';

const AddProjectCard = ({ onAddProject }) => {
  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      onAddProject?.(projectName.trim());
      setProjectName('');
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    setProjectName('');
    setShowForm(false);
  };

  if (showForm) {
    return (
      <div className="bg-gray-300 rounded-lg aspect-square p-4 flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name"
            className="flex-1 bg-white rounded-md px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="flex space-x-2 mt-3">
            <button
              type="submit"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-md py-2 text-sm font-medium transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md py-2 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
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
  );
};

export default AddProjectCard;