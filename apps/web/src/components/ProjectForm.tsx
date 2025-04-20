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

  const modalFooter = (
    <div className="flex justify-end space-x-3">
      <Button variant="outline" onClick={handleClose}>
        Cancel
      </Button>
      <Button onClick={handleSubmit}>{initialData ? 'Update Project' : 'Create Project'}</Button>
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
        <Input
          label="Project Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter a descriptive title"
          error={errors.title}
          className="mb-4"
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Description
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your project and what kind of teammates you're looking for"
            className={`block w-full px-3 py-2 border ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm min-h-[120px]`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tech stack:</label>

          <div className="flex flex-wrap mb-2">
            {selectedSkills.map(skill => (
              <SkillTag key={skill} skill={skill} onRemove={() => removeSkill(skill)} />
            ))}
          </div>

          {errors.skills && <p className="mt-1 text-sm text-red-600">{errors.skills}</p>}

          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1">Select from available skills:</p>
            <div className="flex flex-wrap p-3 border border-gray-200 rounded-md max-h-40 overflow-y-auto">
              {availableSkills
                .filter(skill => !selectedSkills.includes(skill))
                .map(skill => (
                  <div
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className="cursor-pointer m-1"
                  >
                    <SkillTag skill={skill} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectForm;
