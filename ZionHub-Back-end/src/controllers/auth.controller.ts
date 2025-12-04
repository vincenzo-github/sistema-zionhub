import { Request, Response } from 'express';
import { z } from 'zod';
import { loginSchema, registerSchema } from '../schemas/auth';
import { loginUser, createUser } from '../services/auth.service';
import { logger } from '../config/logger';
import { API_ERRORS } from '../config/constants';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const validation = loginSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: {
            code: API_ERRORS.VALIDATION_ERROR,
            message: 'Validation failed',
            details: validation.error.errors,
          },
        });
      }

      const { church_id, email, password } = validation.data;

      const result = await loginUser(church_id, email, password);

      if (!result) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Invalid credentials',
          },
        });
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = result.user;

      return res.json({
        success: true,
        data: {
          user: userWithoutPassword,
          token: result.token,
        },
      });
    } catch (error: any) {
      logger.error('Login error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const validation = registerSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: {
            code: API_ERRORS.VALIDATION_ERROR,
            message: 'Validation failed',
            details: validation.error.errors,
          },
        });
      }

      const { church_id, email, password, full_name } = validation.data;

      const user = await createUser(church_id, email, password, full_name, false);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return res.status(201).json({
        success: true,
        data: {
          user: userWithoutPassword,
          message: 'User registered successfully',
        },
      });
    } catch (error: any) {
      logger.error('Register error:', error);

      // Check if it's a unique constraint violation
      if (error.message?.includes('unique')) {
        return res.status(409).json({
          success: false,
          error: {
            code: API_ERRORS.CONFLICT,
            message: 'Email already registered',
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

  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        });
      }

      return res.json({
        success: true,
        data: {
          userId,
          churchId: req.churchId,
          role: req.userRole,
          isMaster: req.isMaster,
        },
      });
    } catch (error: any) {
      logger.error('Get profile error:', error);
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
