describe('Admin Package (US001-US006)', () => {
  let adminToken: string;

  beforeAll(async () => {
    // Setup admin user and permissions
    adminToken = await createAdminUser();
  });

  // US001: Admin Account Management
  test('should create new admin account', async () => {
    const res = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email: 'newadmin@lms.com', role: 'ADMIN' });

    expect(res.status).toBe(201);
    expect(res.body.role).toBe('ADMIN');
  });

  // US004: User Management
  test('should list assigned users', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
