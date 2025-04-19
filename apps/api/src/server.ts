import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { projectRoutes } from './routes/project';
import { skillRoutes } from './routes/skill';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.API_PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`API server running on port ${port}`);
  });
}

export default app; 