const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Vechain Interaction Server",
      version: "1.0.0",
      description: "API documentation with Vechain Interaction for Swagger",
    },
    servers: [
      {
        url: "https://ve-api.outfit4rent.online",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "https",
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
