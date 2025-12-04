import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const eventController = new EventController();

// List events
router.get('/', authMiddleware, (req, res) => eventController.listEvents(req, res));

// Create event
router.post('/', authMiddleware, (req, res) => eventController.createEvent(req, res));

// Get specific event
router.get('/:id', authMiddleware, (req, res) => eventController.getEvent(req, res));

// Update event
router.put('/:id', authMiddleware, (req, res) => eventController.updateEvent(req, res));

// Delete event
router.delete('/:id', authMiddleware, (req, res) => eventController.deleteEvent(req, res));

// Publish event (finalize schedule)
router.post('/:id/publish', authMiddleware, (req, res) =>
  eventController.publishEvent(req, res)
);

export default router;
