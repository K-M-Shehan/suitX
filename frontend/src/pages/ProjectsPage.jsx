import React, { useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import AddProjectCard from '../components/AddProjectCard';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Project 1' },
    { id: 2, name: 'Project 2' },
    { id: 3, name: 'Project 3' },
    { id: 4, name: 'Project 4' },
  ]);

  const handleAddProject = (projectName) => {
    const newProject = {
      id: Date.now(), // Simple ID generation
      name: projectName,
    };
    setProjects([...projects, newProject]);
  };

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">All Projects</h1>
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* Add Project Card - Always first */}
        <AddProjectCard onAddProject={handleAddProject} />
        
        {/* Existing Projects */}
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={handleDeleteProject}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;