import { Router } from 'express';
import { VolunteerController } from '../controllers/volunteer.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const volunteerController = new VolunteerController();

// List all volunteers
router.get('/', authMiddleware, (req, res) =>
  volunteerController.listVolunteers(req, res)
);

// Create volunteer
router.post('/', authMiddleware, (req, res) =>
  volunteerController.createVolunteer(req, res)
);

// Get volunteer by ID
router.get('/:volunteerId', authMiddleware, (req, res) =>
  volunteerController.getVolunteer(req, res)
);

// Update volunteer
router.put('/:volunteerId', authMiddleware, (req, res) =>
  volunteerController.updateVolunteer(req, res)
);

// Activate volunteer
router.post('/:volunteerId/activate', authMiddleware, (req, res) =>
  volunteerController.activateVolunteer(req, res)
);

// Deactivate volunteer
router.post('/:volunteerId/deactivate', authMiddleware, (req, res) =>
  volunteerController.deactivateVolunteer(req, res)
);

export default router;
