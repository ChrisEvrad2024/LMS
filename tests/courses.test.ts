describe('Courses Package (US007-US018)', () => {
  let instructorToken: string;
  let studentToken: string;

  beforeAll(async () => {
    instructorToken = await createInstructorUser();
    studentToken = await createStudentUser();
  });

  // US007: Course Creation
  test('should create new course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({ title: 'New Course' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  // US013: Course Enrollment
  test('should enroll student in course', async () => {
    const course = await createTestCourse();
    const res = await request(app)
      .post(`/api/courses/${course.id}/enroll`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(res.status).toBe(200);
    expect(res.body.enrolled).toBe(true);
  });
});
