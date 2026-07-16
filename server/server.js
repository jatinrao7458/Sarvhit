import app from "./src/app.js";
import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
import connectDB from "./src/config/db.js";
import { initSocket } from "./src/socket.js";
import logger from "./src/utils/logger.js";

dotenv.config({ path: "../.env" });

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
initSocket(server);

// ---------- Start Server ----------
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      logger.info(`✅ Sarvhit API running on http://localhost:${PORT}`);
      logger.info(`📄 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => {
    logger.error("MONGO db connection failed !!! " + err);
    process.exit(1);
  });

// ---------- Graceful Shutdown ----------
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  
  server.close(() => {
    logger.info("HTTP server closed.");
    
    mongoose.connection.close(false, () => {
      logger.info("MongoDB connection closed.");
      process.exit(0);
    });
  });

  // Force close after 10 seconds if graceful shutdown fails
  setTimeout(() => {
    logger.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  gracefulShutdown("UNHANDLED REJECTION");
});
process.on("uncaughtException", (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  gracefulShutdown("UNCAUGHT EXCEPTION");
});

