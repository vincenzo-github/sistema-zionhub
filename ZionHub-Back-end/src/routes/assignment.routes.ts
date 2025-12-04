import { Router } from 'express';
import { AssignmentController } from '../controllers/assignment.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const assignmentController = new AssignmentController();

// Get event schedule (all assignments for an event)
router.get('/event/:eventId', authMiddleware, (req, res) =>
  assignmentController.getEventSchedule(req, res)
);

// Create assignment (escalate volunteer)
router.post('/event/:eventId', authMiddleware, (req, res) =>
  assignmentController.createAssignment(req, res)
);

// Update assignment
router.put('/:assignmentId', authMiddleware, (req, res) =>
  assignmentController.updateAssignment(req, res)
);

// Delete assignment
router.delete('/:assignmentId', authMiddleware, (req, res) =>
  assignmentController.deleteAssignment(req, res)
);

// Check in
router.post('/:assignmentId/checkin', authMiddleware, (req, res) =>
  assignmentController.checkIn(req, res)
);

// Check out
router.post('/:assignmentId/checkout', authMiddleware, (req, res) =>
  assignmentController.checkOut(req, res)
);

// Get pending assignments for church
router.get('/', authMiddleware, (req, res) =>
  assignmentController.getPendingAssignments(req, res)
);

export default router;
