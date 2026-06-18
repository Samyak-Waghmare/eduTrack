import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"
import connectDB from "./database/db.js";
import userRoute from "./routes/user.route.js"
import courseRoute from "./routes/course.route.js"
import coursePurchaseRoute from "./routes/coursePurchase.route.js"
import courseProgressRoute from "./routes/courseProgress.route.js"
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import http from "http";
import { initSocket } from "./utils/socket.js";

dotenv.config({});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

connectDB();
const app = express();
const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 8080

import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Webhook route must be before express.json() because Stripe requires raw body
import webhookRoute from "./routes/webhook.route.js"
app.use("/api/v1/webhook", webhookRoute)

app.use(helmet());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 2000, 
    message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/", apiLimiter);

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials:true
}))

app.get("/api/v1/health", (_req, res) => {
    res.status(200).json({ success: true, status: "ok", uptime: process.uptime() });
})

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

import adminRoute from "./routes/admin.route.js"
import engagementRoute from "./routes/engagement.route.js"
import analyticsRoute from "./routes/analytics.route.js"
import noteRoute from "./routes/note.route.js"

app.use("/api/v1/user", userRoute)
app.use("/api/v1/course", courseRoute)
app.use("/api/v1/purchase", coursePurchaseRoute)
app.use("/api/v1/progress", courseProgressRoute)
app.use("/api/v1/admin", adminRoute)
app.use("/api/v1/engagement", engagementRoute)
app.use("/api/v1/analytics", analyticsRoute)
app.use("/api/v1/note", noteRoute)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    })
})

import { globalErrorHandler } from "./middleware/error.middleware.js";

app.use(globalErrorHandler);

server.listen(PORT, () => {
})
