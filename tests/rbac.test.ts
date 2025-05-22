import request from 'supertest';
import app from '../src/app';
import { User, Role, Permission } from '../src/models';
import { redisClient } from '../src/config/redis';

describe('RBAC Extended Tests', () => {
  // ... (setup existant conservé)

  describe('Edge Cases Testing', () => {
    test('Multiple roles per user should combine permissions', async () => {
      // Création d'un utilisateur avec deux rôles
      const user = await User.create({
        email: 'multirole@test.com',
        password: 'pass123'
      });

      await Role.bulkCreate([
        { type: 'STUDENT', userId: user.id },
        { type: 'INSTRUCTOR', userId: user.id }
      ]);

      // Login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'multirole@test.com', password: 'pass123' });
      const token = loginRes.body.token;

      // Vérification des permissions combinées
      const createRes = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${token}`);
      expect(createRes.status).toBe(201); // Hérité d'INSTRUCTOR

      const deleteRes = await request(app)
        .delete(`/api/courses/${createRes.body.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(deleteRes.status).toBe(403); // Limité par STUDENT
    });

    test('Disabled permissions should override role hierarchy', async () => {
      // Désactivation spécifique pour ADMIN
      await Permission.create({
        resource: 'course',
        create: false,
        read: true,
        update: true,
        delete: true,
        roleId: 3 // ADMIN
      });

      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(403); // Malgré la hiérarchie
    });
  });

  describe('Performance Testing', () => {
    test('Cache should improve response time for repeated requests', async () => {
      // Premier appel (cold cache)
      const startTime1 = Date.now();
      await request(app)
        .get('/api/courses')
        .set('Authorization', `Bearer ${studentToken}`);
      const duration1 = Date.now() - startTime1;

      // Deuxième appel (cached)
      const startTime2 = Date.now();
      await request(app)
        .get('/api/courses')
        .set('Authorization', `Bearer ${studentToken}`);
      const duration2 = Date.now() - startTime2;

      expect(duration2).toBeLessThan(duration1 * 0.5); // 50% plus rapide
    });
  });

  describe('Security Testing', () => {
    test('Invalid tokens should be rejected', async () => {
      const res = await request(app)
        .get('/api/courses')
        .set('Authorization', 'Bearer invalid_token');
      expect(res.status).toBe(401);
    });

    test('Role tampering should be prevented', async () => {
      // Tentative de modification malicieuse du rôle
      const hackedToken = `${studentToken.slice(0, -10)}ADMIN${studentToken.slice(-6)}`;
      
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${hackedToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe('Audit Logging', () => {
    test('Access denied should generate audit log', async () => {
      const auditLogsBefore = await AuditLog.count();

      await request(app)
        .delete('/api/courses/1')
        .set('Authorization', `Bearer ${instructorToken}`);

      const auditLogsAfter = await AuditLog.count();
      expect(auditLogsAfter).toBe(auditLogsBefore + 1);
    });
  });
});
