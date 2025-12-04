import { Request, Response } from 'express';
import { EventStorage } from '../storage/event.storage';
import { logger } from '../config/logger';
import { API_ERRORS } from '../config/constants';

export class EventController {
  private eventStorage: EventStorage;

  constructor() {
    this.eventStorage = new EventStorage();
  }

  async listEvents(req: Request, res: Response) {
    try {
      const churchId = req.churchId;
      const { status, ministry_id, startDate, endDate } = req.query;

      if (!churchId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        });
      }

      const events = await this.eventStorage.listByChurch(churchId, {
        status: status as string,
        ministry_id: ministry_id as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      return res.json({
        success: true,
        data: events,
      });
    } catch (error: any) {
      logger.error('List events error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async getEvent(req: Request, res: Response) {
    try {
      const churchId = req.churchId;
      const { id } = req.params;

      if (!churchId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        });
      }

      const event = await this.eventStorage.getEventById(id, churchId);

      if (!event) {
        return res.status(404).json({
          success: false,
          error: {
            code: API_ERRORS.NOT_FOUND,
            message: 'Event not found',
          },
        });
      }

      return res.json({
        success: true,
        data: event,
      });
    } catch (error: any) {
      logger.error('Get event error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async createEvent(req: Request, res: Response) {
    try {
      const churchId = req.churchId;
      const userId = req.userId;
      const { name, type, date, start_time, end_time, location, ministry_id } = req.body;

      if (!churchId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        });
      }

      // Validate required fields
      if (!name || !date || !start_time || !end_time) {
        return res.status(400).json({
          success: false,
          error: {
            code: API_ERRORS.VALIDATION_ERROR,
            message: 'Missing required fields: name, date, start_time, end_time',
          },
        });
      }

      const event = await this.eventStorage.createEvent({
        church_id: churchId,
        name,
        type,
        date,
        start_time,
        end_time,
        location,
        ministry_id,
        status: 'draft',
        is_draft: true,
        workflow_stage: 'created',
        created_by: userId,
      });

      return res.status(201).json({
        success: true,
        data: event,
        message: 'Event created successfully',
      });
    } catch (error: any) {
      logger.error('Create event error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async updateEvent(req: Request, res: Response) {
    try {
      const churchId = req.churchId;
      const { id } = req.params;
      const { name, type, date, start_time, end_time, location, status } = req.body;

      if (!churchId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        });
      }

      const event = await this.eventStorage.updateEvent(id, churchId, {
        name,
        type,
        date,
        start_time,
        end_time,
        location,
        status,
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          error: {
            code: API_ERRORS.NOT_FOUND,
            message: 'Event not found',
          },
        });
      }

      return res.json({
        success: true,
        data: event,
        message: 'Event updated successfully',
      });
    } catch (error: any) {
      logger.error('Update event error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      const churchId = req.churchId;
      const { id } = req.params;

      if (!churchId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        });
      }

      const success = await this.eventStorage.deleteEvent(id, churchId);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: {
            code: API_ERRORS.NOT_FOUND,
            message: 'Event not found',
          },
        });
      }

      return res.json({
        success: true,
        message: 'Event deleted successfully',
      });
    } catch (error: any) {
      logger.error('Delete event error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async publishEvent(req: Request, res: Response) {
    try {
      const churchId = req.churchId;
      const { id } = req.params;

      if (!churchId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        });
      }

      const event = await this.eventStorage.publishEvent(id, churchId);

      if (!event) {
        return res.status(404).json({
          success: false,
          error: {
            code: API_ERRORS.NOT_FOUND,
            message: 'Event not found',
          },
        });
      }

      return res.json({
        success: true,
        data: event,
        message: 'Event published successfully',
      });
    } catch (error: any) {
      logger.error('Publish event error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }
}
