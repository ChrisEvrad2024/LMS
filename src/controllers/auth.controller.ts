import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ROLES } from '../config/constants';
import { apiResponse } from '../utils/apiResponse';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, roleType } = req.body;
      
      if (!Object.values(ROLES).includes(roleType)) {
        return apiResponse(res, 400, 'Invalid role type');
      }

      const { user, token } = await AuthService.register(email, password, roleType);
      return apiResponse(res, 201, 'User registered successfully', { user, token });
    } catch (error) {
      return apiResponse(res, 400, error.message);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);
      return apiResponse(res, 200, 'Login successful', { user, token });
    } catch (error) {
      return apiResponse(res, 401, error.message);
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;
      const result = await AuthService.changePassword(userId, oldPassword, newPassword);
      return apiResponse(res, 200, 'Password changed successfully', result);
    } catch (error) {
      return apiResponse(res, 400, error.message);
    }
  }
}
