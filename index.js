import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import crypto from "crypto";
import http from "http";
import swaggerUi from "swagger-ui-express";
import warehouseRoutes from "./Routes/warehouse.js";
import compression from "compression";
import loginAppsRoutes from "./Routes/login.js";
import registrationRoutes from "./Routes/regis.js";
import { getRequestLogger } from "./Config/logger.js";
import { performanceLogger } from "./Middleware/performanceLogger.js";
import { errorHandler } from "./Middleware/errorHandler.js";
import { specs } from "./Config/swagger.js";
import websocketClientService from "./services/websocketClientService.js";

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

// Basic Auth Middleware untuk Swagger
const basicAuth = (req, res, next) => {
  if (process.env.SWAGGER_ENABLED !== "true") {
    return res.status(404).send("Documentation not available");
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.setHeader(
      "WWW-Authenticate",
      'Basic realm="Swagger API Documentation"',
    );
    return res.status(401).send("Authentication required");
  }

  const credentials = Buffer.from(
    authHeader.split(" ")[1],
    "base64",
  ).toString();
  const [username, password] = credentials.split(":");

  const validUsername = process.env.SWAGGER_USERNAME;
  const validPassword = process.env.SWAGGER_PASSWORD;

  if (username !== validUsername || password !== validPassword) {
    return res.status(401).send("Invalid credentials");
  }

  next();
};

// Swagger Documentation dengan Basic Auth (Default UI)
app.use(
  "/api-docs",
  basicAuth,
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Warehouse Stockout API Documentation",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      deepLinking: true,
      showExtensions: true,
      showCommonExtensions: true,
      displayOperationId: true,
      supportedSubmitMethods: ["get", "post", "put", "delete", "patch"],
      // Tambahkan opsi untuk memastikan fitur export tersedia
      showMutatedRequest: true,
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
    },
  }),
);

// Endpoint untuk export dokumentasi (backup)
app.get("/api-docs/export/:format", basicAuth, (req, res) => {
  const format = req.params.format;

  if (format === "json") {
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="warehouse-stockout-api.json"',
    );
    res.json(specs);
  } else if (format === "yaml") {
    // Simple YAML conversion
    let yaml = "";
    const convertToYaml = (obj, indent = 0) => {
      const spaces = "  ".repeat(indent);
      for (const [key, value] of Object.entries(obj)) {
        if (value === null || value === undefined) continue;
        if (typeof value === "object" && !Array.isArray(value)) {
          yaml += spaces + key + ":\n" + convertToYaml(value, indent + 1);
        } else if (Array.isArray(value)) {
          yaml += spaces + key + ":\n";
          value.forEach((item) => {
            if (typeof item === "object") {
              yaml += spaces + "  -\n" + convertToYaml(item, indent + 2);
            } else {
              yaml += spaces + "  - " + item + "\n";
            }
          });
        } else {
          yaml += spaces + key + ": " + value + "\n";
        }
      }
      return yaml;
    };

    convertToYaml(specs);
    res.setHeader("Content-Type", "text/yaml");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="warehouse-stockout-api.yaml"',
    );
    res.send(yaml);
  } else {
    res.status(400).json({
      error: "Invalid format",
      message: "Available formats: json, yaml",
      usage: "GET /api-docs/export/json, /api-docs/export/yaml",
    });
  }
});

app.use("/api/warehouse", warehouseRoutes);
app.use("/api/loginApps", loginAppsRoutes);
app.use("/api/registration", registrationRoutes);

// Error handler middleware
app.use(errorHandler);

const server = http.createServer(app);

websocketClientService.initialize();

server.listen(port, () => {
  console.log(
    `Server Running On Port ${port} [${process.env.NODE_ENV || "development"}]`,
  );

  if (process.env.SWAGGER_ENABLED === "true") {
    console.log(
      `API Documentation available at: http://localhost:${port}/api-docs`,
    );
    console.log(`Export endpoints available at:`);
    console.log(`  - /api-docs/export/json`);
    console.log(`  - /api-docs/export/yaml`);
  } else {
    console.log("Swagger Documentation is disabled");
  }
});

export default server;
