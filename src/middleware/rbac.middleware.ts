import { Request, Response, NextFunction } from 'express';
import { Role, Permission } from '../models/rbac';
import { redisClient } from '../config/redis';
import { apiResponse } from '../utils/apiResponse';

// Hiérarchie des rôles
const ROLE_HIERARCHY = {
  SUPER_ADMIN: ['ADMIN', 'INSTRUCTOR', 'STUDENT'],
  ADMIN: ['INSTRUCTOR', 'STUDENT'],
  INSTRUCTOR: ['STUDENT']
};

// Cache TTL (1 heure)
const CACHE_TTL = 3600;

export const requireRole = (requiredRole: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return apiResponse(res, 401, 'Authentification requise');
      }

      // Vérification cache Redis
      const cacheKey = `user:${req.user.id}:roles`;
      let roles = await redisClient.get(cacheKey);

      if (!roles) {
        roles = await Role.findAll({ 
          where: { userId: req.user.id },
          include: [Permission]
        });
        await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(roles));
      } else {
        roles = JSON.parse(roles);
      }

      // Vérification hiérarchique
      const hasAccess = roles.some(role => 
        role.type === requiredRole || 
        (ROLE_HIERARCHY[requiredRole]?.includes(role.type))
      );

      if (!hasAccess) {
        logAccessDenied(req);
        return apiResponse(res, 403, 'Permissions insuffisantes');
      }

      // Attacher les permissions à la requête
      req.permissions = roles.flatMap(role => role.permissions);
      
      next();
    } catch (error) {
      console.error('RBAC Error:', error);
      return apiResponse(res, 500, 'Erreur interne du serveur');
    }
  };
};

function logAccessDenied(req: Request) {
  console.log(`[SECURITY] Accès refusé pour ${req.user?.email} à ${req.path}`);
  // TODO: Implémenter l'audit trail
}
