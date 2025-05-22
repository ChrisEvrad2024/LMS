import { Request } from 'express';
import { AuditLog } from '../models/AuditLog.model';

export async function logAction(
  req: Request,
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  try {
    await AuditLog.create({
      userId: req.user?.id,
      action,
      entityType,
      entityId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata
    });
  } catch (error) {
    console.error('Audit Log Error:', error);
  }
}
