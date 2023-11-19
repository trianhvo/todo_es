const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todos API',
      version: '1.0.0',
      description: 'API for managing tasks & users.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    components: {
      schemas: {
        CreateTaskSchema: require('../app/validation/schema/createTaskSchema.json'),
        UpdateTaskSchema: require('../app/validation/schema/updateTaskSchema.json'),
        CreateUserSchema: require('../app/validation/schema/createUserSchema.json'),
        UpdateUserSchema: require('../app/validation/schema/updateUserSchema.json'),
        ChangePasswordSchema: require('../app/validation/schema/changePasswordSchema.json'),
        // More
      },
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  security: [
    {
      jwt: [],
    },
  ],
  apis: [
    './src/routes/tasks.js',
    './src/routes/users.js',
    './src/routes/mappings.js',
    './src/routes/templates.js'
    // More
  ],
};

module.exports = swaggerOptions;
