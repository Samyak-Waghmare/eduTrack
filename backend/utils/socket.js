import { Server } from "socket.io";
import http from "http";

let io;
const userSocketMap = {};

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true
        }
    });

    io.on("connection", (socket) => {

        socket.on("register", (userId) => {
            if (userId) {
                userSocketMap[userId] = socket.id;
            }
        });

        socket.on("join_lecture_qa", (lectureId) => {
            socket.join(`qa_${lectureId}`);
        });

        socket.on("leave_lecture_qa", (lectureId) => {
            socket.leave(`qa_${lectureId}`);
        });

        socket.on("disconnect", () => {

            for (const [userId, socketId] of Object.entries(userSocketMap)) {
                if (socketId === socket.id) {
                    delete userSocketMap[userId];
                    break;
                }
            }
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const getSocketIdByUserId = (userId) => {
    return userSocketMap[userId];
};
