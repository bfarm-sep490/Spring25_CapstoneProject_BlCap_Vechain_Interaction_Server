const express = require("express");
const FarmRouter = require("./routes/farm-route");
const AuthenRouter = require("./routes/authen-route");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swaggerConfig");
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = 3000;

const app = express();
dotenv.config();
app.use(cors({
  origin:  '*',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.get("/", (req, res) => {
  res.send("Hello, World! This is my Node.js server!");
});

app.use("/", FarmRouter);
app.use("/", AuthenRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});