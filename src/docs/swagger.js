const swaggerJSDoc = require('swagger-jsdoc');

function buildOpenApiSpec() {
  const options = {
    definition: {
      openapi: '3.0.3',
      info: {
        title: 'Mocks API',
        version: '1.0.0',
        description: 'API en Express + Mongoose (mocks + users + pets).',
      },
      servers: [
        {
          url: 'http://127.0.0.1:{port}',
          description: 'Local',
          variables: {
            port: {
              default: '3000',
            },
          },
        },
      ],
      components: {
        schemas: {
          User: {
            type: 'object',
            properties: {
              _id: { type: 'string', description: 'Mongo ObjectId' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              email: { type: 'string', format: 'email' },
              password: { type: 'string', description: 'Hashed password' },
              role: { type: 'string', enum: ['user', 'admin'] },
              pets: { type: 'array', items: { type: 'string' } },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          ApiResponseUsers: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'success' },
              payload: { type: 'array', items: { $ref: '#/components/schemas/User' } },
            },
          },
          ApiError: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'error' },
              error: { type: 'string' },
            },
          },
        },
      },
    },
    apis: [
      './src/routes/*.js',
    ],
  };

  return swaggerJSDoc(options);
}

module.exports = { buildOpenApiSpec };
