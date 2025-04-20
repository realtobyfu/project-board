import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// GET /api/skills - Get all available skills
router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from('skills').select('name').order('name');

    if (error) {
      console.error('Error fetching skills:', error);
      return res.status(500).json({ error: 'Failed to fetch skills' });
    }

    // Extract skill names from the results
    const skillNames = data.map(skill => skill.name);
    res.status(200).json(skillNames);
  } catch (error) {
    console.error('Error in GET /api/skills:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/skills - Add a new skill
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Skill name is required' });
    }

    const { data, error } = await supabase.from('skills').insert([{ name }]).select().single();

    if (error) {
      if (error.code === '23505') {
        // Postgres unique violation code
        return res.status(409).json({ error: 'This skill already exists' });
      }
      console.error('Error creating skill:', error);
      return res.status(500).json({ error: 'Failed to create skill' });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error in POST /api/skills:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export const skillRoutes = router;
