import { logger } from "../Config/logger.js";

export const performanceLogger = (req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;

    const logLevel =
      res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";

    const status = {
      code: res.statusCode,
      category:
        res.statusCode >= 500
          ? "error"
          : res.statusCode >= 400
          ? "client_error"
          : res.statusCode >= 300
          ? "redirect"
          : res.statusCode >= 200
          ? "success"
          : "info",
    };

    logger[logLevel]("Request completed", {
      timestamp: new Date().toLocaleString(),
      method: req.method,
      url: req.url,
      status,
      duration: `${duration.toFixed(2)}ms`,
      requestId: req.id,
      ...(status.category === "client_error" && {
        validationErrors: res.locals.validationErrors,
        body: process.env.NODE_ENV === "development" ? req.body : undefined,
      }),
      ...(status.category === "server_error" && {
        error: res.locals.error,
        stack:
          process.env.NODE_ENV === "development"
            ? res.locals.error?.stack
            : undefined,
      }),
    });
  });

  next();
};
