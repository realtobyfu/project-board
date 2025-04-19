import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Badge, Button } from '@project-board/ui';
import ProjectForm from '../components/ProjectForm';

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  createdAt: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const filteredProjects = selectedSkills.length > 0
    ? projects.filter(project => 
        selectedSkills.some(skill => project.skills.includes(skill))
      )
    : projects;

  const handleCreateProject = async (newProject: Omit<Project, 'id' | 'createdAt'>) => {
    try {
      const response = await axios.post('http://localhost:4000/api/projects', newProject);
      setProjects([...projects, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={() => setIsModalOpen(true)}>Create Project</Button>
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
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-center py-8 text-gray-500">
          No projects found matching your criteria. Try adjusting your filters or create a new project.
        </p>
      )}

      <ProjectForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateProject}
        availableSkills={skills}
      />
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <p className="text-gray-600 mb-4">{project.description}</p>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-500 mb-1">Skills needed:</h4>
        <div className="flex flex-wrap">
          {project.skills.map(skill => (
            <Badge key={skill} text={skill} className="mr-1 mb-1" />
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button size="sm" variant="outline">Contact</Button>
      </div>
    </div>
  );
};

export default ProjectList; 