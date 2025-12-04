import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/login', (req, res) => authController.login(req, res));
router.post('/register', (req, res) => authController.register(req, res));

// Protected routes
router.get('/me', authMiddleware, (req, res) => authController.getProfile(req, res));

export default router;
