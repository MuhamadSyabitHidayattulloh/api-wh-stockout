import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";
import DailyRotateFile from "winston-daily-rotate-file";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tentukan environment
const isDevelopment = process.env.NODE_ENV === "development";

const transports = [
  // Transport for error log
  new DailyRotateFile({
    filename: path.join(__dirname, "../logs/wh-stockout-error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "14d",
    level: "error",
    zippedArchive: true,
  }),
  new DailyRotateFile({
    filename: path.join(
      __dirname,
      "../logs/wh-stockout-application-%DATE%.log"
    ),
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "14d",
    zippedArchive: true,
  }),
];

if (isDevelopment) {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          return `[${timestamp}] ${level}: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
          }`;
        })
      ),
    })
  );
}

// Create logger
export const logger = winston.createLogger({
  // level: "info",
  level: isDevelopment ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format((info) => {
      if (!isDevelopment) {
        (info.environtment = "production"),
          (info.hostname = process.env.HOSTNAME);
      }
      return info;
    })()
  ),
  transports,
  // Additional configuration for production
  ...(isDevelopment
    ? {}
    : {
        // Reject if error while logging
        exitOnError: false,
        // Handle uncaught exceptions
        handleExceptions: true,
        // Handle unhandled rejections
        handleRejections: true,
      }),
});

export const getRequestLogger = () => {
  if (isDevelopment) {
    return (req, res, next) => {
      logger.debug("Incoming request", {
        date: new Date().toLocaleString(),
        method: req.method,
        url: req.url,
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      });
      next();
    };
  } else {
    return (req, res, next) => {
      logger.info("Incoming request", {
        date: new Date().toLocaleString(),
        method: req.method,
        url: req.url,
        ip: req.ip,
      });
      next();
    };
  }
};
