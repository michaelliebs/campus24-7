import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// Connect DB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/comments", commentRoutes);

export default app;
