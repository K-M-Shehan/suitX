import React, { useState, useRef, useEffect } from 'react';

const StatusDropdown = ({ currentStatus, onStatusChange, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const statuses = [
    { value: 'TODO', label: 'To Do', color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    { value: 'DONE', label: 'Done', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { value: 'BLOCKED', label: 'Blocked', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
  ];

  const currentStatusObj = statuses.find(s => s.value === currentStatus) || statuses[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleStatusClick = (e) => {
    e.stopPropagation(); // Prevent task card click event
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleStatusSelect = (status) => {
    if (status !== currentStatus) {
      onStatusChange(status);
    }
    setIsOpen(false);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'TODO': 'bg-gray-100 text-gray-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'DONE': 'bg-green-100 text-green-800',
      'BLOCKED': 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Current Status Badge */}
      <button
        onClick={handleStatusClick}
        disabled={disabled}
        className={`px-2 py-1 rounded text-xs font-medium inline-flex items-center space-x-1 transition-all ${getStatusColor(currentStatus)} ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-md'
        }`}
      >
        <span>{currentStatusObj.label}</span>
        {!disabled && (
          <svg
            className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={(e) => {
                e.stopPropagation();
                handleStatusSelect(status.value);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                status.value === currentStatus
                  ? 'bg-gray-100 font-semibold'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(status.value)}`}>
                {status.label}
              </span>
              {status.value === currentStatus && (
                <svg
                  className="inline-block w-4 h-4 ml-2 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
