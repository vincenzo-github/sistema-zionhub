import { Request, Response } from 'express';
import { VolunteerStorage } from '../storage/volunteer.storage';
import { UserStorage } from '../storage/user.storage';
import { logger } from '../config/logger';
import { API_ERRORS } from '../config/constants';

export class VolunteerController {
  private volunteerStorage: VolunteerStorage;
  private userStorage: UserStorage;

  constructor() {
    this.volunteerStorage = new VolunteerStorage();
    this.userStorage = new UserStorage();
  }

  async listVolunteers(req: Request, res: Response) {
    try {
      const { search } = req.query;
      const volunteers = await this.volunteerStorage.listVolunteers(
        req.churchId!,
        search as string | undefined
      );

      return res.json({
        success: true,
        data: volunteers,
      });
    } catch (error: any) {
      logger.error('VolunteerController.listVolunteers error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Failed to list volunteers',
        },
      });
    }
  }

  async getVolunteer(req: Request, res: Response) {
    try {
      const { volunteerId } = req.params;

      const volunteer = await this.volunteerStorage.getVolunteerById(
        req.churchId!,
        volunteerId
      );

      return res.json({
        success: true,
        data: volunteer,
      });
    } catch (error: any) {
      logger.error('VolunteerController.getVolunteer error:', error);
      return res.status(404).json({
        success: false,
        error: {
          code: API_ERRORS.NOT_FOUND,
          message: error.message || 'Volunteer not found',
        },
      });
    }
  }

  async createVolunteer(req: Request, res: Response) {
    try {
      const { email, full_name, phone, whatsapp } = req.body;

      // Validate required fields
      if (!email || !full_name) {
        return res.status(400).json({
          success: false,
          error: {
            code: API_ERRORS.VALIDATION_ERROR,
            message: 'Email and full_name are required',
          },
        });
      }

      // Create user account for volunteer
      const volunteer = await this.userStorage.createUser(
        req.churchId!,
        email,
        full_name,
        Math.random().toString(36).slice(-8), // Generate random temporary password
        'member',
        false
      );

      // Update with additional volunteer fields
      const updated = await this.volunteerStorage.updateVolunteer(
        req.churchId!,
        volunteer.id,
        { phone, whatsapp }
      );

      return res.status(201).json({
        success: true,
        data: updated,
      });
    } catch (error: any) {
      logger.error('VolunteerController.createVolunteer error:', error);
      return res.status(400).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: error.message || 'Failed to create volunteer',
        },
      });
    }
  }

  async updateVolunteer(req: Request, res: Response) {
    try {
      const { volunteerId } = req.params;
      const { full_name, phone, whatsapp, position } = req.body;

      const updated = await this.volunteerStorage.updateVolunteer(
        req.churchId!,
        volunteerId,
        { full_name, phone, whatsapp, position }
      );

      return res.json({
        success: true,
        data: updated,
      });
    } catch (error: any) {
      logger.error('VolunteerController.updateVolunteer error:', error);
      return res.status(400).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: error.message || 'Failed to update volunteer',
        },
      });
    }
  }

  async activateVolunteer(req: Request, res: Response) {
    try {
      const { volunteerId } = req.params;

      const updated = await this.volunteerStorage.activateVolunteer(
        req.churchId!,
        volunteerId
      );

      return res.json({
        success: true,
        data: updated,
        message: 'Volunteer activated',
      });
    } catch (error: any) {
      logger.error('VolunteerController.activateVolunteer error:', error);
      return res.status(400).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: error.message || 'Failed to activate volunteer',
        },
      });
    }
  }

  async deactivateVolunteer(req: Request, res: Response) {
    try {
      const { volunteerId } = req.params;

      const updated = await this.volunteerStorage.deactivateVolunteer(
        req.churchId!,
        volunteerId
      );

      return res.json({
        success: true,
        data: updated,
        message: 'Volunteer deactivated',
      });
    } catch (error: any) {
      logger.error('VolunteerController.deactivateVolunteer error:', error);
      return res.status(400).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: error.message || 'Failed to deactivate volunteer',
        },
      });
    }
  }
}
