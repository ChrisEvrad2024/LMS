# LMS Backend System

## Features
- Role-Based Access Control (RBAC)
- Course Management
- Redis Caching
- Rate Limiting
- Request Logging
- Security Headers
- Internationalization (i18n)

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0
- Redis

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run migrations: `npm run migrate`
5. Start the server: `npm start`

### Testing
Run integration tests:
```bash
npm test
```

## API Documentation
Access Swagger UI at `/api-docs` when the server is running

## Deployment
```bash
docker-compose up --build
```
