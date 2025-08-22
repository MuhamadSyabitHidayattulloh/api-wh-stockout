import { logger } from "../Config/logger.js";

const getLogLevel = (statusCode) => {
  if (statusCode >= 500) return "error";
  if (statusCode >= 400) return "warn";
  return "info";
};
const getStatusCategory = (statusCode) => {
  if (statusCode >= 500) return "error";
  if (statusCode >= 400) return "client_error";
  if (statusCode >= 300) return "redirect";
  if (statusCode >= 200) return "success";
};

const getAdditionalLogData = (status, req, res) => {
  const additionalData = {};

  if (status.category === "client_error") {
    additionalData.validationErrors = res.locals.validationErrors;
    if (process.env.NODE_ENV === "development") {
      additionalData.body = req.body;
    }
  }

  if (status.category === "error") {
    additionalData.error = res.locals.error;
    if (process.env.NODE_ENV === "development") {
      additionalData.stack = res.locals.error?.stack;
    }
  }

  return additionalData;
};

export const performanceLogger = (req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;

    const logLevel = getLogLevel(res.statusCode);
    const status = {
      code: res.statusCode,
      category: getStatusCategory(res.statusCode),
    };
    const baseLogData = {
      timestamp: new Date().toLocaleString(),
      method: req.method,
      url: req.url,
      status,
      duration: `${duration.toFixed(2)}ms`,
      requestId: req.id,
    };

    const additionalData = getAdditionalLogData(status, req, res);
    const logData = { ...baseLogData, ...additionalData };

    logger[logLevel]("Request Completed", logData);
  });

  next();
};
