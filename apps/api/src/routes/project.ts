import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

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
}

const router = Router();

// GET /api/projects - Get all projects
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('GET /api/projects - Fetching all projects');

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({
        error: 'Failed to fetch projects',
        details: error.message,
        code: error.code,
      });
    }

    console.log(`Successfully fetched ${data?.length || 0} projects`);
    res.status(200).json(data || []);
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    let errorMessage = 'Server error';
    let errorDetails = '';

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || '';
    }

    res.status(500).json({
      error: errorMessage,
      details: errorDetails,
    });
  }
});

// GET /api/projects/:id - Get a specific project
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Project not found' });
      }
      console.error('Error fetching project:', error);
      return res.status(500).json({ error: 'Failed to fetch project' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error in GET /api/projects/:id:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/projects - Create a new project
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, skills, userId, contact_method, contact_info } = req.body;

    // Validate input
    if (!title || !description || !Array.isArray(skills) || !userId) {
      return res.status(400).json({
        error: 'Title, description, skills array, and userId are required',
      });
    }

    // Validate contact method if provided
    if (contact_method && !['email', 'phone', 'discord'].includes(contact_method)) {
      return res.status(400).json({
        error: 'Invalid contact method. Must be email, phone, or discord',
      });
    }

    // Validate contact info if contact method is provided
    if (contact_method && !contact_info) {
      return res.status(400).json({
        error: 'Contact info is required when contact method is provided',
      });
    }

    // Insert new project into Supabase
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          title,
          description,
          skills,
          user_id: userId,
          ...(contact_method && contact_info && {
            contact_method,
            contact_info,
          }),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return res.status(500).json({ error: 'Failed to create project' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/projects/:id - Update a project
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, skills, userId, contact_method, contact_info } = req.body;

    // Validate input
    if (!title || !description || !Array.isArray(skills) || !userId) {
      return res.status(400).json({
        error: 'Title, description, skills array, and userId are required',
      });
    }

    // Validate contact method if provided
    if (contact_method && !['email', 'phone', 'discord'].includes(contact_method)) {
      return res.status(400).json({
        error: 'Invalid contact method. Must be email, phone, or discord',
      });
    }

    // Validate contact info if contact method is provided
    if (contact_method && !contact_info) {
      return res.status(400).json({
        error: 'Contact info is required when contact method is provided',
      });
    }

    // First check if the project exists and belongs to the user
    const { data: existingProject, error: fetchError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Project not found' });
      }
      console.error('Error fetching project:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch project' });
    }

    if (existingProject.user_id !== userId) {
      return res.status(403).json({ error: 'You do not have permission to update this project' });
    }

    // Update the project
    const { data, error } = await supabase
      .from('projects')
      .update({
        title,
        description,
        skills,
        ...(contact_method && contact_info && {
          contact_method,
          contact_info,
        }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return res.status(500).json({ error: 'Failed to update project' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error in PUT /api/projects/:id:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // First check if the project exists and belongs to the user
    const { data: existingProject, error: fetchError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Project not found' });
      }
      console.error('Error fetching project:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch project' });
    }

    if (existingProject.user_id !== userId) {
      return res.status(403).json({ error: 'You do not have permission to delete this project' });
    }

    // Delete the project
    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      return res.status(500).json({ error: 'Failed to delete project' });
    }

    res.status(204).end();
  } catch (error) {
    console.error('Error in DELETE /api/projects/:id:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export const projectRoutes = router;
