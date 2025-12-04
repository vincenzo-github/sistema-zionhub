import { Router } from 'express';
import { MinistryController } from '../controllers/ministry.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const ministryController = new MinistryController();

// List all ministries
router.get('/', authMiddleware, (req, res) =>
  ministryController.listMinistries(req, res)
);

// Create ministry
router.post('/', authMiddleware, (req, res) =>
  ministryController.createMinistry(req, res)
);

// Get specific ministry
router.get('/:id', authMiddleware, (req, res) =>
  ministryController.getMinistry(req, res)
);

// Update ministry
router.put('/:id', authMiddleware, (req, res) =>
  ministryController.updateMinistry(req, res)
);

// Delete ministry
router.delete('/:id', authMiddleware, (req, res) =>
  ministryController.deleteMinistry(req, res)
);

export default router;
