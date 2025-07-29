import { logger } from "../Config/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error("Error occurred", {
    timestamp: new Date().toLocaleString(),
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ...(process.env.NODE_ENV === "development" && {
      body: req.body,
      query: req.query,
      params: req.params,
    }),
    userId: req.user?.id,
    requestId: req.id,
  });

  const response = {
    status: err.status || 500,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  };
  res.status(response.status).json(response);
};

export class AppError extends Error {
  constructor(message, status = 500) {
    super(message),
      (this.status = status),
      (this.name = this.constructor.name),
      Error.captureStackTrace(this, this.constructor);
  }
}
