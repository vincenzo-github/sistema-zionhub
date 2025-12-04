import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const dashboardController = new DashboardController();

// Get church dashboard stats
router.get('/church', authMiddleware, (req, res) =>
  dashboardController.getChurchDashboard(req, res)
);

// Get user dashboard (personal)
router.get('/user', authMiddleware, (req, res) =>
  dashboardController.getUserDashboard(req, res)
);

// Get event analytics
router.get('/events/:eventId', authMiddleware, (req, res) =>
  dashboardController.getEventAnalytics(req, res)
);

export default router;
