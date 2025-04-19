import { Router, Request, Response } from 'express';
import { skills } from '../models/data';

const router = Router();

// GET /api/skills - Get all available skills
router.get('/', (req: Request, res: Response) => {
  // Future Supabase implementation will query database here
  res.status(200).json(skills);
});

export const skillRoutes = router; 