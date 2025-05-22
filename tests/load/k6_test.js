import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },  // Ramp-up
    { duration: '1m', target: 200 },    // Charge normale
    { duration: '30s', target: 0 },     // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% des requêtes < 500ms
    http_req_failed: ['rate<0.01'],    // Taux d'échec < 1%
  },
};

export default function () {
  const loginRes = http.post('http://localhost:3000/api/auth/login', JSON.stringify({
    email: `user_${__VU}@test.com`,
    password: 'test123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200,
  });

  const token = loginRes.json('data.token');
  
  const courseRes = http.get('http://localhost:3000/api/courses', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  check(courseRes, {
    'courses fetched': (r) => r.status === 200,
  });

  sleep(1);
}
