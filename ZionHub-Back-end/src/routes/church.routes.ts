import { Router } from 'express';
import { ChurchController } from '../controllers/church.controller';
import { authMiddleware, requireMaster } from '../middlewares/auth';

const router = Router();
const churchController = new ChurchController();

// Public endpoints (sem autenticação)
router.post('/', (req, res) => churchController.createChurch(req, res));
router.get('/', (req, res) => churchController.getAllChurches(req, res));

// Authenticated endpoints
router.get('/my-church', authMiddleware, (req, res) => churchController.getChurch(req, res));
router.put('/my-church', authMiddleware, requireMaster, (req, res) =>
  churchController.updateChurch(req, res)
);

export default router;