const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require('swagger-ui-express');

const isProd = process.env.NODE_ENV !== 'development';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vechain Interaction Server",
      version: "1.0.0",
      description: "API documentation with Vechain Interaction for Swagger",
    },
    servers: [
      {
        url: isProd 
          ? 'https://ve-api.outfit4rent.online' 
          : 'http://localhost:3000',            
        description: isProd ? 'Production Server' : 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = swaggerSpecs;
