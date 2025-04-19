import request from 'supertest';
import app from '../src/server';
import { projects } from '../src/models/data';

describe('Project Routes', () => {
  describe('GET /api/projects', () => {
    it('should return 200 and all projects', async () => {
      const response = await request(app).get('/api/projects');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/projects', () => {
    it('should create a new project and return 201', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'This is a test project',
        skills: ['JavaScript', 'React']
      };

      const initialLength = projects.length;
      
      const response = await request(app)
        .post('/api/projects')
        .send(projectData);
      
      expect(response.status).toBe(201);
      expect(response.body.title).toBe(projectData.title);
      expect(response.body.description).toBe(projectData.description);
      expect(response.body.skills).toEqual(projectData.skills);
      expect(response.body.id).toBeDefined();
      
      // Verify the project was added to the in-memory store
      expect(projects.length).toBe(initialLength + 1);
    });

    it('should return 400 for invalid input', async () => {
      const invalidData = {
        // Missing title and skills
        description: 'Invalid project data'
      };
      
      const response = await request(app)
        .post('/api/projects')
        .send(invalidData);
      
      expect(response.status).toBe(400);
    });
  });
}); 