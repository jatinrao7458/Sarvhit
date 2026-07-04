import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// ---------- Security ----------
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

// ---------- Body Parsing ----------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ---------- Health Check ----------
app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ---------- API Routes ----------
// Import and mount routes here as they are created:
// import authRoutes from "./routes/authRoutes.js";
// app.use("/api/v1/auth", authRoutes);

// ---------- 404 Handler ----------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
