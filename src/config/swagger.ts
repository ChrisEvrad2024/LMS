import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';
import { env } from './env';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LMS API Documentation',
      version,
      description: `
        ## API Overview
        
        **Learning Management System** backend with:
        - JWT Authentication
        - Role-Based Access Control
        - Redis Caching
        - Advanced Analytics
        
        ### Error Codes
        
        | Code | Domain                | Description                     |
        |------|-----------------------|---------------------------------|
        | 1xxx | Authentication        | Login, registration, sessions   |
        | 2xxx | Authorization         | Permissions, roles              |
        | 3xxx | Courses               | Content management              |
        | 4xxx | Notifications         | Delivery system                 |
        | 5xxx | Analytics             | Reporting metrics               |
        | 9xxx | System                | Infrastructure issues           |
        
        ### Sample Error
        \`\`\`json
        {
          "error": {
            "code": 1001,
            "message": "Invalid credentials",
            "details": "Email/password combination incorrect",
            "timestamp": "2023-11-20T12:00:00Z"
          }
        }
        \`\`\`
      `,
      contact: {
        name: 'API Support',
        email: 'support@lms.com'
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api`,
        description: 'Development server'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Invalid or missing authentication',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: { type: 'integer', example: 1001 },
                message: { type: 'string', example: 'Invalid credentials' },
                details: { type: 'string', example: 'Email/password combination incorrect' },
                timestamp: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            type: { 
              type: 'string',
              enum: ['SYSTEM', 'COURSE', 'SECURITY', 'ANALYTICS']
            },
            message: { type: 'string' },
            isRead: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app: any) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  app.get('/api-docs.json', (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

export default setupSwagger;
