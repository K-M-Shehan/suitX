import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import AddProjectCard from "../components/AddProjectCard";
import { getAllProjects, createProject as apiCreateProject, deleteProject as apiDeleteProject } from "../services/ProjectService";
import RiskService from "../services/RiskService";

function LaunchpadPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [risks, setRisks] = useState([]);
  const [error, setError] = useState('');

  // Load projects and risks from API on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Fetch projects
        const projectData = await getAllProjects();
        if (mounted) {
          // Show only first 5 projects on launchpad
          setProjects(projectData.slice(0, 5));
        }

        // Fetch risks
        const riskData = await RiskService.getAllRisks();
        if (mounted) {
          // Show only first 3 active/identified risks (exclude IGNORED and RESOLVED)
          const activeRisks = riskData
            .filter(risk => 
              (risk.status === 'IDENTIFIED' || risk.status === 'MONITORING') &&
              risk.status !== 'IGNORED' && 
              risk.status !== 'RESOLVED'
            )
            .slice(0, 3);
          setRisks(activeRisks);
        }
      } catch (e) {
        console.error('Failed to load data:', e);
        if (mounted) setError('Please login to view your data.');
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleAddProject = async (projectName) => {
    try {
      const created = await apiCreateProject(projectName);
      setProjects((prev) => [...prev, created].slice(0, 5));
    } catch (e) {
      console.error('Failed to create project:', e);
      setError('Failed to create project. Make sure you are logged in.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await apiDeleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (e) {
      console.error('Failed to delete project:', e);
      setError('Failed to delete project.');
    }
  };

  const handleResolveRisk = async (riskId) => {
    try {
      await RiskService.resolveRisk(riskId);
      setRisks((prev) => prev.filter((r) => r.id !== riskId));
    } catch (e) {
      console.error('Failed to resolve risk:', e);
      setError('Failed to resolve risk.');
    }
  };

  const handleIgnoreRisk = async (riskId, riskTitle) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to ignore the risk "${riskTitle}"?\n\nIt will be moved to the ignored section in the Risk Dashboard.`
    );
    
    if (!confirmed) {
      return; // User cancelled, do nothing
    }

    // User confirmed, proceed with ignoring
    try {
      console.log('Attempting to ignore risk:', riskId);
      const result = await RiskService.ignoreRisk(riskId);
      console.log('Successfully ignored risk:', result);
      // Remove from launchpad view (will still show in Risk Dashboard under "Ignored")
      setRisks((prev) => prev.filter((r) => r.id !== riskId));
      setError(''); // Clear any previous errors
    } catch (e) {
      console.error('Failed to ignore risk:', e);
      setError(`Failed to ignore risk: ${e.message}`);
    }
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    const colors = {
      'LOW': 'bg-blue-100',
      'MEDIUM': 'bg-yellow-100',
      'HIGH': 'bg-orange-100',
      'CRITICAL': 'bg-red-100'
    };
    return colors[severity] || 'bg-purple-100';
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Launchpad</h1>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{error}</div>
      )}
      
      {/* Projects Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Projects</h2>
          <Link 
            to="/projects"
            className="text-sm font-medium text-cyan-600 hover:text-cyan-700 transition-colors flex items-center gap-1"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {/* Add Project Card */}
          <AddProjectCard onAddProject={handleAddProject} />
          
          {/* Project Cards */}
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      </section>

      {/* Risks Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Active Risks</h2>
          <Link 
            to="/risks"
            className="text-sm font-medium text-cyan-600 hover:text-cyan-700 transition-colors flex items-center gap-1"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {risks.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No active risks. Great job! 🎉
            </div>
          ) : (
            risks.map((risk) => (
              <div 
                key={risk.id} 
                className={`${getSeverityColor(risk.severity)} rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow`}
                onClick={() => navigate(`/risks/${risk.id}`)}
              >
                {/* Risk Header */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">{risk.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    risk.severity === 'CRITICAL' ? 'bg-red-200 text-red-800' :
                    risk.severity === 'HIGH' ? 'bg-orange-200 text-orange-800' :
                    risk.severity === 'MEDIUM' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-blue-200 text-blue-800'
                  }`}>
                    {risk.severity}
                  </span>
                </div>
                
                {/* Risk Description */}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {risk.description || 'No description provided.'}
                </p>

                {/* Risk Type & AI Badge */}
                <div className="flex gap-2 mb-4">
                  {risk.type && (
                    <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
                      {risk.type}
                    </span>
                  )}
                  {risk.aiGenerated && (
                    <span className="text-xs px-2 py-1 rounded bg-purple-200 text-purple-700 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 7H7v6h6V7z"/>
                        <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd"/>
                      </svg>
                      AI
                    </span>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolveRisk(risk.id);
                    }}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                  >
                    Resolve
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleIgnoreRisk(risk.id, risk.title);
                    }}
                    className="text-gray-500 hover:text-gray-600 font-medium text-sm transition-colors"
                  >
                    Ignore
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default LaunchpadPage;