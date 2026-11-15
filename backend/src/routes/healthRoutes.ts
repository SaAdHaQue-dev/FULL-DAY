import { Router, Request, Response } from 'express';
import { isDatabaseConnected } from '../config/db.js';

export const healthRouter = Router();

healthRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    database: isDatabaseConnected() ? 'connected (mongodb)' : 'in-memory (awaiting MONGODB_URI)',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    service: 'taskora-render-backend',
  });
});
