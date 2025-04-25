import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { projectRoutes } from './routes/project';
import { skillRoutes } from './routes/skill';
import { healthRoutes } from './routes/health';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.API_PORT || 4000;

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL, // Your Vercel frontend URL will be set as env var
];

// Log environment variables (without sensitive values)
console.log('Starting server with config:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`- PORT: ${port}`);
console.log(`- FRONTEND_URL configured: ${!!process.env.FRONTEND_URL}`);
console.log(`- SUPABASE_URL configured: ${!!process.env.SUPABASE_URL}`);
console.log(`- SUPABASE_SERVICE_KEY configured: ${!!process.env.SUPABASE_SERVICE_KEY}`);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, etc)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);

// Health check routes
app.use('/health', healthRoutes);

// Simple health check route for basic connectivity testing
app.get('/', (req, res) => {
  res.status(200).send('API is running');
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`API server running on port ${port}`);
  });
}

export default app;
