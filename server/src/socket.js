import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;
const userSockets = new Map(); // Map userId to socketId

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true,
        }
    });

    io.use((socket, next) => {
        try {
            // First try to get token from handshake auth, then from cookies if possible
            const token = socket.handshake.auth?.token || socket.handshake.headers?.cookie?.split('accessToken=')?.[1]?.split(';')?.[0];
            
            if (!token) {
                return next(new Error("Authentication error: No token provided"));
            }

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "fallback_access_secret");
            socket.user = decoded; // Attach user info to socket
            next();
        } catch (err) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`🔌 User connected: ${socket.user._id} (socket: ${socket.id})`);
        
        // Store socket ID for this user
        userSockets.set(socket.user._id.toString(), socket.id);

        socket.on("disconnect", () => {
            console.log(`🔌 User disconnected: ${socket.user._id}`);
            userSockets.delete(socket.user._id.toString());
        });
    });
};

export const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const getUserSocketId = (userId) => {
    return userSockets.get(userId.toString());
};

// Utility function to emit a notification to a specific user
export const emitNotification = (userId, notification) => {
    const socketId = getUserSocketId(userId);
    if (socketId) {
        io.to(socketId).emit("new_notification", notification);
    }
};
