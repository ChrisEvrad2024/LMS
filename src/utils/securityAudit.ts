import { AuditLog } from '../models';
import { redisClient } from '../config/redis';

export async function runSecurityAudit() {
  // 1. Détection tentatives de force brute
  const bruteForceAttempts = await AuditLog.count({
    where: {
      action: 'LOGIN_FAILED',
      createdAt: { [Op.gt]: new Date(Date.now() - 3600000) }
    }
  });

  if (bruteForceAttempts > 50) {
    await redisClient.publish('security-alerts', 
      `Brute force attempt detected: ${bruteForceAttempts} failed logins`);
  }

  // 2. Vérification permissions inhabituelles
  const unusualGrants = await Permission.findAll({
    where: { createdAt: { [Op.gt]: new Date(Date.now() - 86400000) } }
  });

  return { bruteForceAttempts, unusualGrants };
}
