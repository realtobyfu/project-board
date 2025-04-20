import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, SkillTag } from '@project-board/ui';

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

type ProjectUpdate = Omit<Project, 'created_at' | 'updated_at'>;
type ProjectCreate = { title: string; description: string; skills: string[] };

interface ProjectFormCreateProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: ProjectCreate) => void;
  availableSkills: string[];
  initialData?: null;
}

interface ProjectFormUpdateProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: ProjectUpdate) => void;
  availableSkills: string[];
  initialData: Project;
}

type ProjectFormProps = ProjectFormCreateProps | ProjectFormUpdateProps;

const ProjectForm: React.FC<ProjectFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  availableSkills,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ title?: string; description?: string; skills?: string }>(
    {}
  );

  // Default skills to use if none are available from API
  const defaultSkills = [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'C++',
    'SQL',
    'NoSQL',
    'GraphQL',
    'REST API',
    'Docker',
    'AWS',
    'Machine Learning',
    'UI/UX',
    'React Native',
    'Tailwind CSS',
    'Express',
    'MongoDB',
    'Firebase',
    'Supabase',
    'Next.js',
    'Vue.js',
    'Angular',
    'Django',
    'Flutter',
  ];

  // Use availableSkills if they exist, otherwise use defaults
  const displaySkills =
    availableSkills && availableSkills.length > 0 ? availableSkills : defaultSkills;

  // Set form values when initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setSelectedSkills(initialData.skills);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedSkills([]);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: { title?: string; description?: string; skills?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (selectedSkills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const projectData = {
      title: title.trim(),
      description: description.trim(),
      skills: selectedSkills,
    };

    // If editing an existing project, include the id and user_id
    if (initialData) {
      onSubmit({
        ...projectData,
        id: initialData.id,
        user_id: initialData.user_id,
      } as ProjectUpdate);
    } else {
      onSubmit(projectData as ProjectCreate);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  // SVG for the plus icon
  const plusIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
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

  const modalFooter = (
    <div className="flex justify-end space-x-3">
      <Button variant="outline" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="neon" onClick={handleSubmit}>
        {initialData ? 'Update Project' : 'Create Project'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={initialData ? 'Edit Project' : 'Create a New Project'}
      footer={modalFooter}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-midnight-700 mb-1">
              Project Title<span className="text-neon-500 ml-1">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              className={`block w-full px-3 py-2 border ${
                errors.title
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-neon-500'
              } rounded-xl shadow-sm focus:outline-none focus:border-transparent focus:ring-2 transition-all duration-200`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-sm font-medium text-midnight-700 mb-1">
              Project Description<span className="text-neon-500 ml-1">*</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your project and what kind of teammates you're looking for"
              className={`block w-full px-3 py-2 border ${
                errors.description
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-neon-500'
              } rounded-xl shadow-sm focus:outline-none focus:border-transparent focus:ring-2 transition-all duration-200 min-h-[120px]`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-midnight-700 mb-1">
              Tech Stack<span className="text-neon-500 ml-1">*</span>
            </label>

            {/* Selected Skills */}
            <div className="flex flex-wrap gap-2 mb-3 min-h-[40px] p-3 bg-midnight-50 rounded-xl">
              {selectedSkills.map(skill => (
                <SkillTag
                  key={skill}
                  skill={skill}
                  onRemove={() => removeSkill(skill)}
                  color="neon"
                />
              ))}
              {selectedSkills.length === 0 && (
                <span className="text-sm text-midnight-500 italic">Select skills from below</span>
              )}
            </div>

            {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}

            {/* Available Skills */}
            <div className="mt-3">
              <div className="flex items-center mb-2">
                <div className="w-1.5 h-1.5 bg-neon-400 rounded-full mr-2"></div>
                <p className="text-sm text-midnight-600 font-medium">Available skills</p>
              </div>

              <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-xl max-h-40 overflow-y-auto bg-white">
                {displaySkills
                  .filter(skill => !selectedSkills.includes(skill))
                  .map(skill => (
                    <div
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className="cursor-pointer transition-transform hover:scale-105"
                    >
                      <SkillTag skill={skill} color="primary" variant="outline" />
                    </div>
                  ))}
                {displaySkills.filter(skill => !selectedSkills.includes(skill)).length === 0 && (
                  <span className="text-sm text-midnight-500 italic">All skills selected</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectForm;
