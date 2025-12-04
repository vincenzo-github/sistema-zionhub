import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger } from './config/logger';
import { testSupabaseConnection } from './config/supabase';
import authRoutes from './routes/auth.routes';
import churchRoutes from './routes/church.routes';
import eventRoutes from './routes/event.routes';
import assignmentRoutes from './routes/assignment.routes';
import volunteerRoutes from './routes/volunteer.routes';
import ministryRoutes from './routes/ministry.routes';
import notificationRoutes from './routes/notification.routes';
import checkinRoutes from './routes/checkin.routes';
import dashboardRoutes from './routes/dashboard.routes';
import gamificationRoutes from './routes/gamification.routes';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://your-domain.com'
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/churches', churchRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/ministries', ministryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/checkin', checkinRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/gamification', gamificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// Start server
async function startServer() {
  try {
    // Test Supabase connection
    const isConnected = await testSupabaseConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to Supabase');
    }

    app.listen(PORT, () => {
      logger.info(`✅ Supabase connection successful`);
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
