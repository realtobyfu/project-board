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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        {user && (
          <Button
            onClick={() => {
              setEditingProject(null);
              setIsModalOpen(true);
              navigate('/projects/new');
            }}
          >
            Create Project
          </Button>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Filter by skills:</h2>
        <div className="flex flex-wrap">
          {skills.map(skill => (
            <div
              key={skill}
              onClick={() => toggleSkillFilter(skill)}
              className={`cursor-pointer m-1 ${
                selectedSkills.includes(skill) ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <Badge
                text={skill}
                color={selectedSkills.includes(skill) ? 'primary' : 'secondary'}
              />
            </div>
          ))}
        </div>
      </div>

      {isLoading ? (
        <p className="text-center py-8">Loading projects...</p>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div key={project.id}>
              {deleteConfirmation === project.id ? (
                <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-300">
                  <p className="text-lg font-medium mb-4">
                    Are you sure you want to delete this project?
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button size="sm" variant="outline" onClick={() => setDeleteConfirmation(null)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
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
        <p className="text-center py-8 text-gray-500">
          No projects found matching your criteria. Try adjusting your filters or create a new
          project.
        </p>
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
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <p className="text-gray-600 mb-4">{project.description}</p>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-500 mb-1">Tech stack:</h4>
        <div className="flex flex-wrap">
          {project.skills.map(skill => (
            <Badge key={skill} text={skill} className="mr-1 mb-1" />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-500">Created on {formatDate(project.created_at)}</p>
      </div>

      <div className="flex justify-end space-x-2">
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
        <Button size="sm" variant="outline">
          Contact
        </Button>
      </div>
    </div>
  );
};

export default ProjectList;
