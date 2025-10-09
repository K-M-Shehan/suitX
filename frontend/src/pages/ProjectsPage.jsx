import React, { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import AddProjectCard from '../components/AddProjectCard';
import { getAllProjects, createProject as apiCreateProject, deleteProject as apiDeleteProject } from '../services/ProjectService';
import { createMultipleTasks } from '../services/TaskService';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  // Load projects from API on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getAllProjects();
        if (mounted) setProjects(data);
      } catch (e) {
        console.error('Failed to load projects:', e);
        if (mounted) setError('Please login to view your projects.');
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleAddProject = async (projectData) => {
    try {
      // Extract tasks from project data
      const tasks = projectData.tasks || [];
      delete projectData.tasks; // Remove tasks from project data
      
      // Create the project first
      const created = await apiCreateProject(projectData);
      setProjects((prev) => [...prev, created]);
      setError(''); // Clear any previous errors
      
      // If there are tasks, create them and link to the project
      if (tasks.length > 0 && created.id) {
        try {
          const taskDtos = tasks.map(taskTitle => ({
            title: taskTitle,
            description: '',
            projectId: created.id,
            status: 'TODO',
            priority: 'MEDIUM'
          }));
          
          await createMultipleTasks(taskDtos, created.id);
          console.log(`Successfully created ${tasks.length} tasks for project ${created.id}`);
        } catch (taskError) {
          console.error('Failed to create tasks:', taskError);
          setError('Project created but some tasks failed to create.');
        }
      }
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
        <h1 className="text-2xl font-semibold text-gray-900">All Projects</h1>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{error}</div>
      )}

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