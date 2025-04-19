import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { projects, Project } from '../models/data';

const router = Router();

// GET /api/projects - Get all projects
router.get('/', (req: Request, res: Response) => {
  // Future Supabase implementation will query database here
  res.status(200).json(projects);
});

// POST /api/projects - Create a new project
router.post('/', (req: Request, res: Response) => {
  try {
    const { title, description, skills } = req.body;

    // Validate input
    if (!title || !description || !Array.isArray(skills)) {
      return res.status(400).json({ error: 'Title, description, and skills array are required' });
    }

    // Create new project
    const newProject: Project = {
      id: uuidv4(),
      title,
      description,
      skills,
      createdAt: new Date()
    };

    // Add to in-memory store (will be replaced with Supabase)
    projects.push(newProject);

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

export const projectRoutes = router; 