import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/core/User.model';
import { compareSync } from 'bcryptjs';

export const AuthService = {
  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user || !compareSync(password, user.password)) {
      throw new Error('Invalid credentials');
    }
    
    return {
      token: jwt.sign(
        { userId: user.id, role: user.role }, 
        env.JWT_SECRET, 
        { expiresIn: '1h' }
      ),
      user
    };
  },

  async refreshToken(token: string) {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    const user = await User.findByPk(decoded.userId);
    if (!user) throw new Error('User not found');
    
    return jwt.sign(
      { userId: user.id, role: user.role }, 
      env.JWT_SECRET, 
      { expiresIn: '1h' }
    );
  }
};
