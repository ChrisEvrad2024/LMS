import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/core/User.model';
import { Authentication } from '../models/core/Authentication.model';
import { logger } from '../utils/logger';

export class AuthService {
  static async register(email: string, password: string, roleType: string) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = await User.create({ email });
    await Authentication.create({ 
      username: email, 
      password, 
      userId: user.id 
    });

    const role = await Role.create({ 
      type: roleType, 
      userId: user.id 
    });

    return { user, role };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new Error('Account not active');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return { user, token };
  }

  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await user.comparePassword(oldPassword);
    if (!isValid) {
      throw new Error('Invalid current password');
    }

    const auth = await Authentication.findOne({ where: { userId } });
    if (!auth) {
      throw new Error('Authentication record not found');
    }

    auth.password = newPassword;
    await auth.save();

    return { success: true };
  }
}
