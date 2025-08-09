import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import crypto from "crypto";
import http from "http";
import warehouseRoutes from "./Routes/warehouse.js";
import compression from "compression";
import loginAppsRoutes from "./Routes/login.js";
import registrationRoutes from "./Routes/regis.js";
import { getRequestLogger } from "./Config/logger.js";
import { performanceLogger } from "./Middleware/performanceLogger.js";
import { errorHandler } from "./Middleware/errorHandler.js";

dotenv.config();

const port = process.env.PORT;
const app = express();

app.use(compression());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

http.globalAgent.maxSockets = Infinity;

app.use((req, res, next) => {
  req.id = crypto.randomUUID();
  next();
});

// Logging Middleware
app.use(getRequestLogger());
app.use(performanceLogger);

// Static files
app.use(express.static("./public"));

app.use("/api/warehouse", warehouseRoutes);
app.use("/api/loginApps", loginAppsRoutes);
app.use("/api/registration", registrationRoutes);

// Error handler middleware
app.use(errorHandler);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(
    `Server Running On Port ${port} [${process.env.NODE_ENV || "development"}]`
  );
});

export default server;
