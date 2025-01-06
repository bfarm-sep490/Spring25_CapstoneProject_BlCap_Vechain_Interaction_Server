const express = require("express");
const routers = require("./routes/farmRoute");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swaggerConfig");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = 3000;

app.use(cors());
app.use(express.json());
dotenv.config();
app.get("/", (req, res) => {
  res.send("Hello, World! This is my Node.js server!");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/", routers);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
