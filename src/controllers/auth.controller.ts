import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ROLES } from '../config/constants';
import { APIError } from '../middleware/errorMiddleware';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, roleType } = req.body;
      
      if (!Object.values(ROLES).includes(roleType)) {
        throw new APIError(1003, req.t('errors.invalid_role'));
      }

      const { user, token } = await AuthService.register(email, password, roleType);
      return res.status(201).json({
        success: true,
        message: req.t('auth.register_success'),
        data: { user, token }
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        throw new APIError(1001, req.t('errors.missing_credentials'));
      }

      const { user, token } = await AuthService.login(email, password);
      return res.status(200).json({
        success: true,
        message: req.t('auth.login_success'),
        data: { user, token }
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { oldPassword, newPassword } = req.body;
      
      if (!oldPassword || !newPassword) {
        throw new APIError(1004, req.t('errors.missing_passwords'));
      }

      await AuthService.changePassword(userId, oldPassword, newPassword);
      return res.status(200).json({
        success: true,
        message: req.t('auth.password_changed')
      });
    } catch (error) {
      next(error);
    }
  }
}
