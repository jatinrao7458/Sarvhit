import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";

// General rate limiter for all standard API routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next) => {
    next(new ApiError(429, "Too many requests from this IP, please try again after 15 minutes"));
  }
});

// Stricter rate limiter for authentication routes (login, register, forgot password)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 requests per windowMs for auth routes
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new ApiError(429, "Too many authentication attempts, please try again after an hour"));
  }
});
