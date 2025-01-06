const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VeChain API",
      version: "1.0.0",
      description: "API documentation for VeChain interactions",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to route files for Swagger annotations
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = swaggerSpecs;
