import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  // Basic health check
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    env: {
      nodeEnv: process.env.NODE_ENV,
      supabaseUrlConfigured: !!process.env.SUPABASE_URL,
      supabaseKeyConfigured: !!process.env.SUPABASE_SERVICE_KEY,
    },
    supabaseStatus: 'pending',
  };

  try {
    // Test Supabase connection
    const { data, error } = await supabase
      .from('projects')
      .select('count', { count: 'exact' })
      .limit(1);

    if (error) {
      healthCheck.supabaseStatus = 'error';
      return res.status(500).json({
        ...healthCheck,
        supabaseError: {
          message: error.message,
          code: error.code,
        },
      });
    }

    healthCheck.supabaseStatus = 'connected';

    return res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.supabaseStatus = 'error';

    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return res.status(500).json({
      ...healthCheck,
      supabaseError: {
        message: errorMessage,
      },
    });
  }
});

export const healthRoutes = router;
