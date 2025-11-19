import React, { useState, useEffect } from 'react';
import { getProjectMembers } from '../services/ProjectService';

const API_BASE_URL = 'https://suitx-backend-production.up.railway.app';

const TaskFormDialog = ({ isOpen, onClose, onSubmit, projectId, project }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    assignedTo: '',
    dueDate: '',
    estimatedHours: '',
  });
  
  const [availableUsers, setAvailableUsers] = useState([]);
  const [memberDetails, setMemberDetails] = useState([]);

  useEffect(() => {
    if (isOpen && projectId) {
      loadProjectMembers();
    }
  }, [isOpen, projectId]);

  const loadProjectMembers = async () => {
    try {
      if (!projectId) return;
      
      // Get member IDs
      const memberIds = await getProjectMembers(projectId);
      
      // Fetch full user details for each member
      const details = await Promise.all(
        memberIds.map(async (userId) => {
          try {
            const response = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            });
            if (response.ok) {
              return await response.json();
            }
            return null;
          } catch (err) {
            console.error(`Error fetching user ${userId}:`, err);
            return null;
          }
        })
      );
      
      const validMembers = details.filter(d => d !== null);
      
      // Also add the project owner if not already in members
      if (project?.createdBy) {
        const ownerAlreadyIncluded = validMembers.some(m => m.username === project.createdBy);
        if (!ownerAlreadyIncluded) {
          try {
            const response = await fetch(`${API_BASE_URL}/api/user/search?q=${project.createdBy}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
            });
            if (response.ok) {
              const users = await response.json();
              const owner = users.find(u => u.username === project.createdBy);
              if (owner) {
                validMembers.unshift(owner); // Add owner at the beginning
              }
            }
          } catch (err) {
            console.error('Error fetching owner:', err);
          }
        }
      }
      
      setMemberDetails(validMembers);
    } catch (err) {
      console.error('Error loading project members:', err);
      // Don't throw error, just log it
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Task title is required');
      return;
    }

    // Convert date string to ISO 8601 LocalDateTime format if provided
    let formattedDueDate = null;
    if (formData.dueDate) {
      // HTML date input returns YYYY-MM-DD, convert to LocalDateTime format
      // Set time to end of day (23:59:59) in local timezone
      const dateObj = new Date(formData.dueDate + 'T23:59:59');
      // Format as ISO 8601 string (YYYY-MM-DDTHH:mm:ss.sssZ)
      formattedDueDate = dateObj.toISOString();
    }

    // Prepare data for submission
    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      projectId: projectId,
      status: formData.status,
      priority: formData.priority,
      assignedTo: formData.assignedTo.trim() || null,
      dueDate: formattedDueDate,
      estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : null,
    };

    onSubmit(taskData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      assignedTo: '',
      dueDate: '',
      estimatedHours: '',
    });
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      assignedTo: '',
      dueDate: '',
      estimatedHours: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Task</h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter task title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Enter task description"
              />
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                  <option value="BLOCKED">Blocked</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            {/* Assigned To and Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned To
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Unassigned</option>
                  {memberDetails.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.firstName && member.lastName
                        ? `${member.firstName} ${member.lastName} (${member.username})`
                        : member.username}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Estimated Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Hours
              </label>
              <input
                type="number"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleChange}
                min="0"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter estimated hours"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskFormDialog;
