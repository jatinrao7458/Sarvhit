import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log the error
  if (statusCode >= 500) {
    logger.error(`${err.message}\n${err.stack}`);
  } else {
    logger.warn(`${err.message}`);
  }

  // Send the error response
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
    // Only send stack trace in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorMiddleware;
