import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import AddProjectCard from "../components/AddProjectCard";
import { getAllProjects, createProject as apiCreateProject, deleteProject as apiDeleteProject } from "../services/ProjectService";

function LaunchpadPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  // Load projects from API on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getAllProjects();
        if (mounted) {
          // Show only first 5 projects on launchpad
          setProjects(data.slice(0, 5));
        }
      } catch (e) {
        console.error('Failed to load projects:', e);
        if (mounted) setError('Please login to view your projects.');
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Risks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Risk Card 1 - Scope Creep */}
          <div className="bg-purple-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Scope Creep</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. 
              Quisque faucibus ex sapien vitae pellentesque sem placerat. 
              In id cursus mi pretium tellus duis convallis.
            </p>
            <div className="flex space-x-3">
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                Resolve
              </button>
              <button className="text-gray-500 hover:text-gray-600 font-medium text-sm">
                Ignore
              </button>
            </div>
          </div>

          {/* Risk Card 2 - Frontend Int. */}
          <div className="bg-purple-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Frontend Int.</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. 
              Quisque faucibus ex sapien vitae pellentesque sem placerat. 
              In id cursus mi pretium tellus duis convallis.
            </p>
            <div className="flex space-x-3">
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                Resolve
              </button>
              <button className="text-gray-500 hover:text-gray-600 font-medium text-sm">
                Ignore
              </button>
            </div>
          </div>

          {/* Risk Card 3 - Deployment */}
          <div className="bg-purple-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Deployment</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. 
              Quisque faucibus ex sapien vitae pellentesque sem placerat. 
              In id cursus mi pretium tellus duis convallis.
            </p>
            <div className="flex space-x-3">
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                Resolve
              </button>
              <button className="text-gray-500 hover:text-gray-600 font-medium text-sm">
                Ignore
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LaunchpadPage;