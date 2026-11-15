import { Router, Request, Response } from 'express';
import { ProjectModel, memoryProjectsStore } from '../models/Project.js';
import { isDatabaseConnected } from '../config/db.js';

export const projectRouter = Router();

// GET /api/projects
projectRouter.get('/', async (_req: Request, res: Response) => {
  try {
    if (isDatabaseConnected()) {
      const projects = await ProjectModel.find();
      return res.json({ success: true, source: 'mongodb', data: projects });
    }
    return res.json({ success: true, source: 'memory', data: memoryProjectsStore });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/projects
projectRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { name, flag, color, progress } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Project name is required' });

    if (isDatabaseConnected()) {
      const project = await ProjectModel.create({ name, flag, color, progress });
      return res.status(201).json({ success: true, source: 'mongodb', data: project });
    }

    const newProject = {
      id: `p-${Date.now()}`,
      name,
      flag: flag || '🎯',
      color: color || '#6C5CE7',
      progress: progress || 0,
    };
    memoryProjectsStore.push(newProject);
    return res.status(201).json({ success: true, source: 'memory', data: newProject });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
