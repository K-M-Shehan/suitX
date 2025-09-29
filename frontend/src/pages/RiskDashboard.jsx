import React from 'react';

const RiskDashboard = () => {
  const riskSummary = [
    { title: 'Total Projects', count: 3 },
    { title: 'Total Risks', count: 3 }
  ];

  const risks = [
    {
      id: 1,
      title: 'Scope Creep',
      description: ' Requirements expanding beyond original project scope due to stakeholder requests.',
      type: 'scope'
    },
    {
      id: 2,
      title: 'Frontend Int.',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.',
      type: 'frontend'
    },
    {
      id: 3,
      title: 'Deployment',
      description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.',
      type: 'deployment'
    }
  ];

  const activeProjects = [
    { id: 1, name: 'Platform Redesign', progress: 50 },
    { id: 2, name: 'Mobile MVP', progress: 75 },
    { id: 3, name: 'Data Mitigation', progress: 95 }
  ];

  return (
    <div className="flex-1 p-8 bg-gray-50">
      {/* Page Header */}
      <div className="flex items-center mb-8">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-2xl font-semibold text-gray-900">Risks</h1>
        </div>
      </div>

      {/* Risk Summary Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Risk Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          {riskSummary.map((item, index) => (
            <div key={index} className="bg-black rounded-lg p-6 text-white">
              <div className="flex flex-col items-center">
                <div className="text-6xl font-bold mb-2">{item.count}</div>
                <div className="text-lg font-medium">{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risks Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Risks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {risks.map((risk, index) => (
            <div key={risk.id} className={`rounded-lg p-6 shadow-sm border ${
              index === 0 ? 'bg-purple-100 border-purple-200' : 
              index === 1 ? 'bg-blue-100 border-blue-200' : 
              'bg-green-100 border-green-200'
            }`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{risk.title}</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{risk.description}</p>
              <div className="flex space-x-2">
                <button className="px-4 py-2 text-blue-600 hover:bg-white hover:bg-opacity-50 rounded-md text-sm font-medium transition-colors">
                  Resolve
                </button>
                <button className="px-4 py-2 text-gray-600 hover:bg-white hover:bg-opacity-50 rounded-md text-sm font-medium transition-colors">
                  Ignore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Projects Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeProjects.map((project) => (
            <div key={project.id} className="bg-gray-200 rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                <div className="text-2xl font-bold text-gray-900">{project.progress}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskDashboard;