// Simple in-memory data store - will be replaced with Supabase later

export interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  createdAt: Date;
}

// Sample data
export const projects: Project[] = [
  {
    id: '1',
    title: 'Machine Learning Study Group',
    description: 'Looking for teammates to build ML projects together. Focus on computer vision and NLP.',
    skills: ['Python', 'TensorFlow', 'Machine Learning'],
    createdAt: new Date('2023-09-15')
  },
  {
    id: '2',
    title: 'Mobile App for Student Events',
    description: 'Building a React Native app to help students discover campus events. Need help with UI/UX and backend.',
    skills: ['React Native', 'Node.js', 'UI/UX'],
    createdAt: new Date('2023-09-20')
  },
];

// Available skills for projects
export const skills: string[] = [
  'JavaScript',
  'TypeScript',
  'React',
  'React Native',
  'Node.js',
  'Express',
  'Python',
  'TensorFlow',
  'Machine Learning',
  'UI/UX',
  'Java',
  'C++',
  'SQL',
  'MongoDB',
  'AWS',
  'DevOps',
]; 