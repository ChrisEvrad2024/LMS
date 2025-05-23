describe('System Package (US025-US030)', () => {
  // US025: Notifications
  test('should send course published notification', async () => {
    const spy = jest.spyOn(NotificationService, 'send');
    await publishTestCourse();
    expect(spy).toHaveBeenCalled();
  });

  // US028: Activity Logging
  test('should log admin actions', async () => {
    const res = await request(app)
      .get('/api/admin/activity-logs')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body[0].action).toBeDefined();
  });
});
