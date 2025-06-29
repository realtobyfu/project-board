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
  contact_method?: 'email' | 'phone' | 'discord';
  contact_info?: string;
  ideal_teammate?: string[];
}

type ProjectCreate = {
  title: string;
  description: string;
  skills: string[];
  contact_method?: 'email' | 'phone' | 'discord';
  contact_info?: string;
  ideal_teammate?: string[];
};
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
  const [showContactForProject, setShowContactForProject] = useState<string | null>(null);

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
        {/* Simplified background with gradient only - removed image */}
        <div className="absolute inset-0 bg-gradient-to-r from-midnight-50/50 to-neon-50/50 rounded-3xl"></div>

        <div className="relative z-10 flex justify-between items-center py-10 px-6">
          <div>
            <h1 className="text-4xl font-bold font-space-grotesk bg-gradient-text bg-clip-text text-transparent">
              Discover Projects
            </h1>
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
              className="ml-4 rounded-xl"
            >
              Create Project
            </Button>
          )}
        </div>
      </div>

      {/* Skills filter section with modern styling */}
      <div className="mb-10 p-6 bg-white rounded-2xl shadow-card border border-gray-100">
        <h2 className="text-lg font-medium mb-4 font-space-grotesk text-midnight-800 flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-neon-400 mr-2"></span>
          <span className="bg-gradient-text bg-clip-text text-transparent">Filter by skills</span>
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
                  onAction={action => {
                    if (action === 'contact') {
                      setShowContactForProject(
                        showContactForProject === project.id ? null : project.id
                      );
                    } else {
                      handleProjectAction(project, action as 'edit' | 'delete');
                    }
                  }}
                  showContact={showContactForProject === project.id}
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
          <p className="text-xl font-medium font-space-grotesk bg-gradient-text bg-clip-text text-transparent mb-2">
            No projects found
          </p>
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
  onAction: (action: 'edit' | 'delete' | 'contact') => void;
  showContact: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, canEdit, onAction, showContact }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  // Format the date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Generate a color scheme based on project ID
  const getColorScheme = (id: string) => {
    const colors = [
      { bg: 'from-purple-400 to-pink-400', accent: 'bg-purple-100', dot: 'bg-purple-500' },
      { bg: 'from-blue-400 to-cyan-400', accent: 'bg-blue-100', dot: 'bg-blue-500' },
      { bg: 'from-orange-400 to-red-400', accent: 'bg-orange-100', dot: 'bg-orange-500' },
      { bg: 'from-green-400 to-teal-400', accent: 'bg-green-100', dot: 'bg-green-500' },
      { bg: 'from-indigo-400 to-purple-400', accent: 'bg-indigo-100', dot: 'bg-indigo-500' },
      { bg: 'from-yellow-400 to-orange-400', accent: 'bg-yellow-100', dot: 'bg-yellow-500' },
      { bg: 'from-pink-400 to-rose-400', accent: 'bg-pink-100', dot: 'bg-pink-500' },
      { bg: 'from-teal-400 to-green-400', accent: 'bg-teal-100', dot: 'bg-teal-500' },
    ];

    // Use the project ID to consistently select a color
    const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const colorScheme = getColorScheme(project.id);

  return (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden group hover:shadow-hover transition-all duration-300 relative h-full flex flex-col">
      {/* Gradient header */}
      <div className={`h-2 bg-gradient-to-r ${colorScheme.bg}`}></div>

      {/* Decorative elements */}
      <div
        className={`absolute -right-6 -top-6 w-12 h-12 ${colorScheme.accent} rounded-full transition-transform group-hover:scale-150 duration-500 opacity-50`}
      ></div>
      <div className="absolute -left-3 -bottom-3 w-6 h-6 bg-midnight-50 rounded-full transition-transform group-hover:scale-150 duration-500"></div>

      <div className="p-6 flex-grow">
        <div className="relative z-10">
          {/* Title with dot accent */}
          <div className="flex items-center mb-2">
            <span className={`inline-block w-2 h-2 rounded-full ${colorScheme.dot} mr-2`}></span>
            <h3 className="text-xl font-bold font-space-grotesk text-midnight-900">
              {project.title}
            </h3>
          </div>

          {/* Description */}
          <div className="mb-4">
            <p className={`text-midnight-600 ${!showFullDescription ? 'line-clamp-3' : ''}`}>
              {project.description}
            </p>
            {project.description.length > 150 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-sm text-neon-600 hover:text-neon-700 mt-1 font-medium"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          {/* Ideal Teammate Requirements */}
          {project.ideal_teammate && project.ideal_teammate.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs uppercase tracking-wide text-midnight-400 mb-2 font-medium">
                Looking for teammates with:
              </h4>
              <div className="space-y-1">
                {project.ideal_teammate.slice(0, 3).map((req, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${colorScheme.dot} flex-shrink-0`}
                    ></span>
                    <span className="text-sm text-midnight-600">{req}</span>
                  </div>
                ))}
                {project.ideal_teammate.length > 3 && (
                  <span className="text-xs text-midnight-400 italic">
                    +{project.ideal_teammate.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          <div className="mb-4">
            <h4 className="text-xs uppercase tracking-wide text-midnight-400 mb-2 font-medium">
              Tech stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.skills.map(skill => (
                <span
                  key={skill}
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colorScheme.accent} text-midnight-700 border border-midnight-200`}
                >
                  {skill}
                </span>
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
          <Button
            size="sm"
            variant={showContact ? 'neon' : 'dark'}
            onClick={() => onAction('contact')}
          >
            {showContact ? 'Hide' : 'Contact'}
          </Button>
        </div>
      </div>

      {/* Contact Information Display */}
      {showContact && (
        <div
          className={`px-6 py-4 bg-gradient-to-r ${colorScheme.bg} bg-opacity-10 border-t border-midnight-100`}
        >
          {project.contact_method && project.contact_info ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Contact Icon */}
                <div
                  className={`w-10 h-10 rounded-lg ${colorScheme.accent} flex items-center justify-center`}
                >
                  {project.contact_method === 'email' && (
                    <svg
                      className="w-5 h-5 text-midnight-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  )}
                  {project.contact_method === 'phone' && (
                    <svg
                      className="w-5 h-5 text-midnight-700"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  )}
                  {project.contact_method === 'discord' && (
                    <svg
                      className="w-5 h-5 text-midnight-700"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                    </svg>
                  )}
                </div>

                {/* Contact Info */}
                <div>
                  <p className="text-xs text-midnight-500 uppercase tracking-wide">
                    {project.contact_method === 'email'
                      ? 'Email'
                      : project.contact_method === 'phone'
                        ? 'Phone'
                        : 'Discord'}
                  </p>
                  <p className="font-mono text-sm text-midnight-800">{project.contact_info}</p>
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(project.contact_info || '');
                }}
                className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                title="Copy to clipboard"
              >
                <svg
                  className="w-4 h-4 text-midnight-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <p className="text-sm text-midnight-500 text-center py-2">
              No contact information provided
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
