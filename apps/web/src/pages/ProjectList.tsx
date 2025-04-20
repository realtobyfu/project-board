import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Badge, Button } from '@project-board/ui';
import ProjectForm from '../components/ProjectForm';
import { useAuth } from '../contexts/AuthContext';

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

type ProjectCreate = { title: string; description: string; skills: string[] };
type ProjectUpdate = Omit<Project, 'created_at' | 'updated_at'>;

const ProjectList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);

  useEffect(() => {
    // If route is /projects/new, open create form
    if (window.location.pathname === '/projects/new') {
      setIsModalOpen(true);
    }

    // If route is /projects/edit/:id, open edit form
    if (id) {
      const fetchProjectToEdit = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/projects/${id}`);
          setEditingProject(response.data);
          setIsModalOpen(true);
        } catch (error) {
          console.error('Error fetching project to edit:', error);
        }
      };
      fetchProjectToEdit();
    }
  }, [id]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/projects');
        setProjects(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setIsLoading(false);
      }
    };

    const fetchSkills = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/skills');
        setSkills(response.data);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchProjects();
    fetchSkills();
  }, []);

  const toggleSkillFilter = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const filteredProjects =
    selectedSkills.length > 0
      ? projects.filter(project => selectedSkills.some(skill => project.skills.includes(skill)))
      : projects;

  const handleCreateProject = async (newProject: ProjectCreate) => {
    try {
      // Add current user's ID to the project data
      const projectWithUser = {
        ...newProject,
        userId: user?.id,
      };

      const response = await axios.post('http://localhost:4000/api/projects', projectWithUser);
      setProjects([...projects, response.data]);
      setIsModalOpen(false);
      navigate('/projects');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async (updatedProject: ProjectUpdate) => {
    try {
      // Map from Supabase snake_case to camelCase for API
      const transformedProject = {
        ...updatedProject,
        userId: updatedProject.user_id, // Map user_id to userId for API
      };

      const response = await axios.put(
        `http://localhost:4000/api/projects/${updatedProject.id}`,
        transformedProject
      );

      setProjects(projects.map(p => (p.id === updatedProject.id ? response.data : p)));
      setIsModalOpen(false);
      setEditingProject(null);
      navigate('/projects');
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/projects/${projectId}`, {
        data: { userId: user?.id },
      });
      setProjects(projects.filter(p => p.id !== projectId));
      setDeleteConfirmation(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleProjectAction = (project: Project, action: 'edit' | 'delete') => {
    if (action === 'edit') {
      setEditingProject(project);
      setIsModalOpen(true);
      navigate(`/projects/edit/${project.id}`);
    } else if (action === 'delete') {
      setDeleteConfirmation(project.id);
    }
  };

  const canEditProject = (project: Project): boolean => {
    return !!user && project.user_id === user.id;
  };

  // Icon SVGs
  const plusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className="pb-20">
      {/* Hero section with decorative elements */}
      <div className="relative mb-12 overflow-hidden">
        <div className="absolute -right-10 -top-24 w-72 h-72 bg-neon-300 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -left-20 top-10 w-72 h-72 bg-midnight-800 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>

        <div className="relative z-10 flex justify-between items-center py-10">
          <div>
            <h1 className="text-4xl font-bold text-midnight-900 font-display">Discover Projects</h1>
            <p className="mt-2 text-midnight-600 max-w-2xl">
              Find exciting collaborations or post your own project ideas to build your team.
            </p>
          </div>

          {user && (
            <Button
              onClick={() => {
                setEditingProject(null);
                setIsModalOpen(true);
                navigate('/projects/new');
              }}
              variant="neon"
              size="lg"
              icon={plusIcon}
              className="ml-4"
            >
              Create Project
            </Button>
          )}
        </div>
      </div>

      {/* Skills filter section with modern styling */}
      <div className="mb-10 p-6 bg-white rounded-2xl shadow-card border border-gray-100">
        <h2 className="text-lg font-medium mb-4 text-midnight-800">
          <span className="inline-block w-2 h-2 rounded-full bg-neon-400 mr-2"></span>
          Filter by skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <div
              key={skill}
              onClick={() => toggleSkillFilter(skill)}
              className="relative cursor-pointer transition-transform hover:scale-105"
            >
              <Badge
                text={skill}
                color={selectedSkills.includes(skill) ? 'neon' : 'primary'}
                variant={selectedSkills.includes(skill) ? 'solid' : 'outline'}
              />
              {selectedSkills.includes(skill) && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-500"></span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Projects grid with modern card design */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 border-4 border-midnight-100 border-t-neon-400 rounded-full animate-spin mb-4"></div>
          <p className="text-midnight-600">Loading amazing projects...</p>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              className="transform transition-all duration-300 hover:-translate-y-1"
            >
              {deleteConfirmation === project.id ? (
                <div className="bg-white rounded-2xl shadow-card p-6 border-2 border-red-300 overflow-hidden relative animate-pulse">
                  <div className="absolute -right-8 -top-8 w-16 h-16 bg-red-100 rounded-full"></div>
                  <div className="absolute -left-4 -bottom-4 w-12 h-12 bg-red-50 rounded-full"></div>

                  <p className="text-lg font-medium mb-4 text-midnight-900">
                    Are you sure you want to delete this project?
                  </p>
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button size="sm" variant="outline" onClick={() => setDeleteConfirmation(null)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ) : (
                <ProjectCard
                  project={project}
                  canEdit={canEditProject(project)}
                  onAction={action => handleProjectAction(project, action)}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-card p-12 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-midnight-50 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-midnight-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <p className="text-xl font-medium text-midnight-700 mb-2">No projects found</p>
          <p className="text-midnight-500 max-w-md mb-6">
            Try adjusting your filter criteria or create a new project to get started.
          </p>
          {user && (
            <Button
              onClick={() => {
                setEditingProject(null);
                setIsModalOpen(true);
                navigate('/projects/new');
              }}
              variant="neon"
              icon={plusIcon}
            >
              Create New Project
            </Button>
          )}
        </div>
      )}

      {/* Render create form when no project is being edited */}
      {isModalOpen && !editingProject && (
        <ProjectForm
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            navigate('/projects');
          }}
          onSubmit={handleCreateProject}
          availableSkills={skills}
          initialData={null}
        />
      )}

      {/* Render edit form when a project is being edited */}
      {isModalOpen && editingProject && (
        <ProjectForm
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProject(null);
            navigate('/projects');
          }}
          onSubmit={handleUpdateProject}
          availableSkills={skills}
          initialData={editingProject}
        />
      )}
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  canEdit: boolean;
  onAction: (action: 'edit' | 'delete') => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, canEdit, onAction }) => {
  // Format the date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden group hover:shadow-hover transition-all duration-300 relative h-full flex flex-col">
      {/* Decorative elements */}
      <div className="absolute -right-6 -top-6 w-12 h-12 bg-neon-100 rounded-full transition-transform group-hover:scale-150 duration-500"></div>
      <div className="absolute -left-3 -bottom-3 w-6 h-6 bg-midnight-50 rounded-full transition-transform group-hover:scale-150 duration-500"></div>

      <div className="p-6 flex-grow">
        <div className="relative z-10">
          {/* Title with dot accent */}
          <div className="flex items-center mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-neon-400 mr-2"></span>
            <h3 className="text-xl font-bold text-midnight-900">{project.title}</h3>
          </div>

          {/* Description */}
          <p className="text-midnight-600 mb-4 line-clamp-3">{project.description}</p>

          {/* Skills */}
          <div className="mb-4">
            <h4 className="text-xs uppercase tracking-wide text-midnight-400 mb-2">Tech stack</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.skills.map(skill => (
                <Badge
                  key={skill}
                  text={skill}
                  color="neon"
                  variant="outline"
                  className="text-xs"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with date and actions */}
      <div className="px-6 py-4 bg-midnight-50 border-t border-midnight-100 flex justify-between items-center">
        <span className="text-xs text-midnight-500">Created {formatDate(project.created_at)}</span>

        <div className="flex space-x-2">
          {canEdit && (
            <>
              <Button size="sm" variant="outline" onClick={() => onAction('edit')}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => onAction('delete')}
              >
                Delete
              </Button>
            </>
          )}
          <Button size="sm" variant="dark">
            Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
