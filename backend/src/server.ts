import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isDatabaseConnected } from './config/db.js';
import { taskRouter } from './routes/taskRoutes.js';
import { projectRouter } from './routes/projectRoutes.js';
import { healthRouter } from './routes/healthRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// CORS configuration to allow Vercel frontend, local dev, and custom domains
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Allow any Vercel preview or production deployment (*.vercel.app)
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        return callback(null, true);
      }

      // Default allow for development / personal workstation
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger for visibility in Render logs
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root Welcome Endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'Taskora / Lingua API',
    description: 'Production backend for personal workstation and productivity management',
    status: 'online',
    database: isDatabaseConnected() ? 'connected (mongodb)' : 'in-memory (set MONGODB_URI to persist)',
    endpoints: {
      health: '/api/health',
      tasks: '/api/tasks',
      projects: '/api/projects',
    },
    version: '1.0.0',
  });
});

// Mount Routes
app.use('/healthz', healthRouter);
app.use('/api/health', healthRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/projects', projectRouter);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Start Server & Connect Database
const startServer = async () => {
  await connectDB();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 [Server] Render Backend listening on port ${PORT}`);
    console.log(`🌐 [Server] Health check available at: http://localhost:${PORT}/api/health`);
    console.log(`📝 [Server] Task endpoints ready at: http://localhost:${PORT}/api/tasks`);
  });
};

startServer();
