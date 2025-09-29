import React, { useState, useEffect } from 'react';
import RiskService from '../services/RiskService';
import ProjectService from '../services/ProjectService';

const RiskDashboard = () => {
  const [riskSummary, setRiskSummary] = useState({
    totalProjects: 0,
    totalRisks: 0
  });
  const [risks, setRisks] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch risk summary
        const summary = await RiskService.getRiskSummary();
        setRiskSummary({
          totalProjects: summary.totalProjects,
          totalRisks: summary.totalRisks
        });

        // Fetch risks
        const risksData = await RiskService.getAllRisks();
        setRisks(risksData);

        // Fetch active projects
        const projectsData = await ProjectService.getActiveProjects();
        setActiveProjects(projectsData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleResolveRisk = async (riskId) => {
    try {
      await RiskService.resolveRisk(riskId);
      // Refresh risks data
      const updatedRisks = await RiskService.getAllRisks();
      setRisks(updatedRisks);
      
      // Refresh summary
      const summary = await RiskService.getRiskSummary();
      setRiskSummary({
        totalProjects: summary.totalProjects,
        totalRisks: summary.totalRisks
      });
    } catch (error) {
      console.error('Error resolving risk:', error);
    }
  };

  const handleIgnoreRisk = async (riskId) => {
    try {
      await RiskService.ignoreRisk(riskId);
      // Refresh risks data
      const updatedRisks = await RiskService.getAllRisks();
      setRisks(updatedRisks);
    } catch (error) {
      console.error('Error ignoring risk:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading dashboard data...</div>
      </div>
    );
  }

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
          <div className="bg-black rounded-lg p-6 text-white">
            <div className="flex flex-col items-center">
              <div className="text-6xl font-bold mb-2">{riskSummary.totalProjects}</div>
              <div className="text-lg font-medium">Total Projects</div>
            </div>
          </div>
          <div className="bg-black rounded-lg p-6 text-white">
            <div className="flex flex-col items-center">
              <div className="text-6xl font-bold mb-2">{riskSummary.totalRisks}</div>
              <div className="text-lg font-medium">Total Risks</div>
            </div>
          </div>
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
                <button 
                  onClick={() => handleResolveRisk(risk.id)}
                  className="px-4 py-2 text-blue-600 hover:bg-white hover:bg-opacity-50 rounded-md text-sm font-medium transition-colors"
                  disabled={risk.status === 'RESOLVED'}
                >
                  {risk.status === 'RESOLVED' ? 'Resolved' : 'Resolve'}
                </button>
                <button 
                  onClick={() => handleIgnoreRisk(risk.id)}
                  className="px-4 py-2 text-gray-600 hover:bg-white hover:bg-opacity-50 rounded-md text-sm font-medium transition-colors"
                  disabled={risk.status === 'IGNORED'}
                >
                  {risk.status === 'IGNORED' ? 'Ignored' : 'Ignore'}
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
                <div className="text-2xl font-bold text-gray-900">{Math.round(project.progressPercentage || 0)}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskDashboard;