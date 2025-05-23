import dotenv from 'dotenv';
dotenv.config();

// Setup global test hooks
beforeAll(async () => {
  // Initialize test database if needed
});

afterAll(async () => {
  // Cleanup test database
});

process.env.NODE_ENV = 'test';
