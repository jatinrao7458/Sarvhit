import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import logger from "./utils/logger.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";

const app = express();

// ---------- Security & Observability ----------
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

// Setup morgan to pipe HTTP logs to winston
app.use(morgan("combined", { stream: logger.stream }));

// Apply rate limiting to all standard API routes
app.use("/api", apiLimiter);

// ---------- Body Parsing & Compression ----------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(compression());

// ---------- Data Sanitization ----------
// Prevent NoSQL injection
app.use(mongoSanitize());
// Prevent HTTP Parameter Pollution
app.use(hpp());

// ---------- Health Check ----------
app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ---------- Routes ----------
import authRoutes from "./routes/auth.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import messageRoutes from "./routes/message.routes.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/messages", messageRoutes);

// ---------- 404 Handler ----------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ---------- Global Error Handler ----------
app.use(errorMiddleware);

export default app;
