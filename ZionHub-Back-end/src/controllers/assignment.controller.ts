import { Request, Response } from 'express';
import { AssignmentStorage } from '../storage/assignment.storage';
import { logger } from '../config/logger';
import { API_ERRORS } from '../config/constants';

export class AssignmentController {
  private assignmentStorage: AssignmentStorage;

  constructor() {
    this.assignmentStorage = new AssignmentStorage();
  }

  async getEventSchedule(req: Request, res: Response) {
    try {
      const { eventId } = req.params;

      const assignments = await this.assignmentStorage.getEventAssignments(eventId);

      return res.json({
        success: true,
        data: assignments,
      });
    } catch (error: any) {
      logger.error('Get event schedule error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async createAssignment(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      const userId = req.userId;
      const { department_role_id, user_id } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        });
      }

      // Validate required fields
      if (!department_role_id || !user_id) {
        return res.status(400).json({
          success: false,
          error: {
            code: API_ERRORS.VALIDATION_ERROR,
            message: 'Missing required fields: department_role_id, user_id',
          },
        });
      }

      const assignment = await this.assignmentStorage.createAssignment({
        event_id: eventId,
        department_role_id,
        user_id,
        status: 'pending',
        assigned_by: userId,
      });

      return res.status(201).json({
        success: true,
        data: assignment,
        message: 'Assignment created successfully',
      });
    } catch (error: any) {
      logger.error('Create assignment error:', error);

      if (error.message?.includes('duplicate')) {
        return res.status(409).json({
          success: false,
          error: {
            code: API_ERRORS.CONFLICT,
            message: 'User already assigned to this role for this event',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async updateAssignment(req: Request, res: Response) {
    try {
      const { assignmentId } = req.params;
      const { status, notes } = req.body;

      const assignment = await this.assignmentStorage.updateAssignment(assignmentId, {
        status,
        notes,
      });

      if (!assignment) {
        return res.status(404).json({
          success: false,
          error: {
            code: API_ERRORS.NOT_FOUND,
            message: 'Assignment not found',
          },
        });
      }

      return res.json({
        success: true,
        data: assignment,
        message: 'Assignment updated successfully',
      });
    } catch (error: any) {
      logger.error('Update assignment error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async deleteAssignment(req: Request, res: Response) {
    try {
      const { assignmentId } = req.params;

      const success = await this.assignmentStorage.deleteAssignment(assignmentId);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: {
            code: API_ERRORS.NOT_FOUND,
            message: 'Assignment not found',
          },
        });
      }

      return res.json({
        success: true,
        message: 'Assignment deleted successfully',
      });
    } catch (error: any) {
      logger.error('Delete assignment error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async checkIn(req: Request, res: Response) {
    try {
      const { assignmentId } = req.params;

      const assignment = await this.assignmentStorage.checkIn(assignmentId);

      if (!assignment) {
        return res.status(404).json({
          success: false,
          error: {
            code: API_ERRORS.NOT_FOUND,
            message: 'Assignment not found',
          },
        });
      }

      return res.json({
        success: true,
        data: assignment,
        message: 'Checked in successfully',
      });
    } catch (error: any) {
      logger.error('Check in error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async checkOut(req: Request, res: Response) {
    try {
      const { assignmentId } = req.params;

      const assignment = await this.assignmentStorage.checkOut(assignmentId);

      if (!assignment) {
        return res.status(404).json({
          success: false,
          error: {
            code: API_ERRORS.NOT_FOUND,
            message: 'Assignment not found',
          },
        });
      }

      return res.json({
        success: true,
        data: assignment,
        message: 'Checked out successfully',
      });
    } catch (error: any) {
      logger.error('Check out error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async getPendingAssignments(req: Request, res: Response) {
    try {
      const churchId = req.churchId;
      const { limit = 10 } = req.query;

      if (!churchId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        });
      }

      const assignments = await this.assignmentStorage.getPendingAssignments(
        churchId,
        parseInt(limit as string) || 10
      );

      return res.json({
        success: true,
        data: assignments,
      });
    } catch (error: any) {
      logger.error('Get pending assignments error:', error);
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
