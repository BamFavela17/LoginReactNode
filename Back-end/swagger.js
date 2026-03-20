import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Gym Management API',
    description: 'Sistema de control de acceso y gestión de usuarios para el gimnasio UES',
  },
  host: 'localhost:5000',
  basePath: '/',
  schemes: ['http'],
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'cookie',
      name: 'token',
      description: 'Token de sesión almacenado en cookies'
    }
  },
  definitions: {
    LoginRequest: {
      email: "admin@gym.com",
      password: "12345"
    },
    AdminRequest: {
          name: "Admin",
          lastname: "pro",
          username: "admin_juan",
          email: "admin@gym.com",
          password: "12345",
          role: "superadmin"
    }
  }
};

const outputFile = './swagger.json'; // El archivo que ya importas en app.js
const endpointsFiles = ['./server.js']; // Punto de entrada donde están definidas las rutas base

swaggerAutogen()(outputFile, endpointsFiles, doc);