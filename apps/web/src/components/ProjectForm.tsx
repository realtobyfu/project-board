import React, { useState, useEffect } from 'react';
import { Modal, Button, SkillTag } from '@project-board/ui';

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

type ProjectUpdate = Omit<Project, 'created_at' | 'updated_at'>;
type ProjectCreate = {
  title: string;
  description: string;
  skills: string[];
  contact_method?: 'email' | 'phone' | 'discord';
  contact_info?: string;
  ideal_teammate?: string[];
};

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
  const [contactMethod, setContactMethod] = useState<'email' | 'phone' | 'discord' | ''>('');
  const [contactInfo, setContactInfo] = useState('');
  const [idealTeammate, setIdealTeammate] = useState<string[]>([]);
  const [currentRequirement, setCurrentRequirement] = useState('');
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false);
  const [customSkill, setCustomSkill] = useState('');
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    skills?: string;
    contact?: string;
  }>({});

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
      setContactMethod((initialData.contact_method || '') as any);
      setContactInfo(initialData.contact_info || '');
      setIdealTeammate(initialData.ideal_teammate || []);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedSkills([]);
    setContactMethod('');
    setContactInfo('');
    setIdealTeammate([]);
    setCurrentRequirement('');
    setShowCustomSkillInput(false);
    setCustomSkill('');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const newErrors: { title?: string; description?: string; skills?: string; contact?: string } =
      {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (selectedSkills.length === 0) {
      newErrors.skills = 'At least one skill is required';
    }

    // Validate contact info if contact method is selected
    if (contactMethod && !contactInfo.trim()) {
      newErrors.contact = 'Contact information is required when a contact method is selected';
    }

    if (!contactMethod && contactInfo.trim()) {
      newErrors.contact = 'Please select a contact method';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const projectData = {
      title: title.trim(),
      description: description.trim(),
      skills: selectedSkills,
      ...(contactMethod &&
        contactInfo.trim() && {
          contact_method: contactMethod,
          contact_info: contactInfo.trim(),
        }),
      ...(idealTeammate.length > 0 && {
        ideal_teammate: idealTeammate,
      }),
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

  const addRequirement = () => {
    if (currentRequirement.trim() && idealTeammate.length < 5) {
      setIdealTeammate([...idealTeammate, currentRequirement.trim()]);
      setCurrentRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setIdealTeammate(idealTeammate.filter((_, i) => i !== index));
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill('');
      setShowCustomSkillInput(false);
    }
  };

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

          {/* Ideal Teammate Requirements */}
          <div>
            <label className="block text-sm font-medium text-midnight-700 mb-1">
              Ideal Teammate Requirements
            </label>
            <p className="text-xs text-midnight-500 mb-3">
              Add up to 5 qualities you're looking for in teammates
            </p>

            {/* Current requirements list */}
            {idealTeammate.length > 0 && (
              <div className="mb-3 space-y-2">
                {idealTeammate.map((req, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-midnight-50 rounded-lg"
                  >
                    <span className="w-2 h-2 rounded-full bg-neon-400 flex-shrink-0"></span>
                    <span className="text-sm text-midnight-700 flex-grow">{req}</span>
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-midnight-400 hover:text-red-500 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new requirement input */}
            {idealTeammate.length < 5 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentRequirement}
                  onChange={e => setCurrentRequirement(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  placeholder="e.g., Strong communication skills"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-neon-500 transition-all duration-200"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRequirement}
                  disabled={!currentRequirement.trim()}
                >
                  Add
                </Button>
              </div>
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

                {/* Add custom skill button */}
                {!showCustomSkillInput && (
                  <button
                    type="button"
                    onClick={() => setShowCustomSkillInput(true)}
                    className="inline-flex items-center px-3 py-1 border-2 border-dashed border-gray-300 rounded-lg text-sm text-midnight-600 hover:border-neon-400 hover:text-neon-600 transition-all"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Custom
                  </button>
                )}

                {/* Custom skill input */}
                {showCustomSkillInput && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={e => setCustomSkill(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCustomSkill();
                        } else if (e.key === 'Escape') {
                          setShowCustomSkillInput(false);
                          setCustomSkill('');
                        }
                      }}
                      placeholder="Custom skill"
                      className="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-neon-500"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={addCustomSkill}
                      className="text-green-600 hover:text-green-700"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCustomSkillInput(false);
                        setCustomSkill('');
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {displaySkills.filter(skill => !selectedSkills.includes(skill)).length === 0 &&
                  !showCustomSkillInput && (
                    <span className="text-sm text-midnight-500 italic">All skills selected</span>
                  )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-midnight-700 mb-1">
              Contact Information
            </label>

            {/* Contact Method */}
            <div>
              <label className="block text-sm text-midnight-600 mb-2">
                How can teammates reach you?
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setContactMethod('email')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    contactMethod === 'email'
                      ? 'border-neon-500 bg-neon-50 text-neon-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setContactMethod('phone')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    contactMethod === 'phone'
                      ? 'border-neon-500 bg-neon-50 text-neon-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Phone
                </button>
                <button
                  type="button"
                  onClick={() => setContactMethod('discord')}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    contactMethod === 'discord'
                      ? 'border-neon-500 bg-neon-50 text-neon-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  title="Discord"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contact Info Input */}
            {contactMethod && (
              <div>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={e => setContactInfo(e.target.value)}
                  placeholder={
                    contactMethod === 'email'
                      ? 'your.email@example.com'
                      : contactMethod === 'phone'
                        ? '+1 (555) 123-4567'
                        : 'YourUsername#1234'
                  }
                  className={`block w-full px-3 py-2 border ${
                    errors.contact
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-neon-500'
                  } rounded-xl shadow-sm focus:outline-none focus:border-transparent focus:ring-2 transition-all duration-200`}
                />
              </div>
            )}

            {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectForm;
