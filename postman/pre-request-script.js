// Script to authenticate different roles before tests
const getAuthToken = async (email, password, varName) => {
  const loginRequest = {
    url: pm.variables.get('baseUrl') + '/api/auth/login',
    method: 'POST',
    header: {
      'Content-Type': 'application/json'
    },
    body: {
      mode: 'raw',
      raw: JSON.stringify({ email, password })
    }
  };

  const response = await pm.sendRequest(loginRequest);
  pm.expect(response.code).to.be.oneOf([200, 201]);
  pm.variables.set(varName, response.json().data.token);
};

pm.test("Setup auth tokens", async function () {
  await getAuthToken('admin@example.com', 'admin123', 'adminToken');
  await getAuthToken('instructor@example.com', 'instructor123', 'instructorToken');
  await getAuthToken('student@example.com', 'student123', 'studentToken');
  await getAuthToken('content@example.com', 'content123', 'contentManagerToken');
});
