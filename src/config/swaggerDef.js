module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LMS API',
      version: '1.0.0',
      description: 'Documentation complète avec exemples pratiques'
    },
    servers: [
      { url: 'http://localhost:3000/api' }
    ],
    components: {
      securitySchemes: {
        JWT: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
          description: 'Format: Bearer {token}'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};
