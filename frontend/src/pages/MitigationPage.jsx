import React, { useState } from 'react';

const MitigationPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');

  const mitigationSummary = [
    { title: 'Total Mitigations', count: 5 },
    { title: 'Active Mitigations', count: 3 }
  ];

  const mitigations = [
    {
      id: 1,
      title: 'Scope Management',
      description: 'Implement strict change control process with approval gates and impact assessments for all scope modifications.',
      status: 'Active',
      priority: 'High',
      assignee: 'Project Manager',
      dueDate: '2025-10-15',
      relatedRisk: 'Scope Creep'
    },
    {
      id: 2,
      title: 'Frontend Integration Testing',
      description: 'Establish comprehensive integration testing framework with automated CI/CD pipeline validation.',
      status: 'Active',
      priority: 'Medium',
      assignee: 'Frontend Team Lead',
      dueDate: '2025-10-20',
      relatedRisk: 'Frontend Int.'
    },
    {
      id: 3,
      title: 'Deployment Automation',
      description: 'Create automated deployment pipeline with rollback capabilities and environment validation checks.',
      status: 'Active',
      priority: 'High',
      assignee: 'DevOps Engineer',
      dueDate: '2025-10-10',
      relatedRisk: 'Deployment'
    },
    {
      id: 4,
      title: 'Code Review Process',
      description: 'Implement mandatory peer review process with quality gates and automated code analysis.',
      status: 'Completed',
      priority: 'Medium',
      assignee: 'Tech Lead',
      dueDate: '2025-09-25',
      relatedRisk: 'Code Quality'
    },
    {
      id: 5,
      title: 'Backup Strategy',
      description: 'Establish comprehensive backup and disaster recovery procedures with regular testing.',
      status: 'Planned',
      priority: 'Low',
      assignee: 'System Admin',
      dueDate: '2025-11-01',
      relatedRisk: 'Data Loss'
    }
  ];

  const filteredMitigations = selectedStatus === 'All' 
    ? mitigations 
    : mitigations.filter(mitigation => mitigation.status === selectedStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Planned':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'Medium':
        return 'text-orange-600 bg-orange-50';
      case 'Low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getCardBackgroundColor = (index) => {
    const colors = [
      'bg-purple-100 border-purple-200',
      'bg-blue-100 border-blue-200',
      'bg-green-100 border-green-200',
      'bg-yellow-100 border-yellow-200',
      'bg-pink-100 border-pink-200'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-semibold text-gray-900">Mitigations</h1>
        </div>

        {/* Status Filter */}
        <div className="flex space-x-2">
          {['All', 'Active', 'Completed', 'Planned'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Mitigation Summary Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Mitigation Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          {mitigationSummary.map((item, index) => (
            <div key={index} className="bg-black rounded-lg p-6 text-white">
              <div className="flex flex-col items-center">
                <div className="text-6xl font-bold mb-2">{item.count}</div>
                <div className="text-lg font-medium">{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mitigations Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Mitigation Strategies</h2>
          <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
            + Add New Mitigation
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMitigations.map((mitigation, index) => (
            <div key={mitigation.id} className={`rounded-lg p-6 shadow-sm border ${getCardBackgroundColor(index)}`}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{mitigation.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(mitigation.status)}`}>
                  {mitigation.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{mitigation.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Priority:</span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(mitigation.priority)}`}>
                    {mitigation.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Assignee:</span>
                  <span className="font-medium text-gray-900">{mitigation.assignee}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Due Date:</span>
                  <span className="font-medium text-gray-900">{mitigation.dueDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Related Risk:</span>
                  <span className="font-medium text-gray-900">{mitigation.relatedRisk}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="px-3 py-1 text-blue-600 hover:bg-white hover:bg-opacity-50 rounded-md text-sm font-medium transition-colors">
                  Edit
                </button>
                <button className="px-3 py-1 text-green-600 hover:bg-white hover:bg-opacity-50 rounded-md text-sm font-medium transition-colors">
                  Mark Complete
                </button>
                <button className="px-3 py-1 text-red-600 hover:bg-white hover:bg-opacity-50 rounded-md text-sm font-medium transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 mb-1">High Priority</h3>
              <div className="text-3xl font-bold text-red-600">
                {mitigations.filter(m => m.priority === 'High').length}
              </div>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Medium Priority</h3>
              <div className="text-3xl font-bold text-orange-600">
                {mitigations.filter(m => m.priority === 'Medium').length}
              </div>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Completed</h3>
              <div className="text-3xl font-bold text-green-600">
                {mitigations.filter(m => m.status === 'Completed').length}
              </div>
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Overdue</h3>
              <div className="text-3xl font-bold text-gray-600">0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MitigationPage;