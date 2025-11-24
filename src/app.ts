import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";
import chatRoutes from "./routes/chat.routes";
import messageRoutes from "./routes/message.routes";
import cors from "cors";
import errorHandler from "./middleware/errorHandler";
import morgan from "morgan";
dotenv.config();
connectDB();

const app = express();

// body parser
app.use(express.json());

// CORS for frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(morgan("dev"));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);

// Error middleware
app.use(errorHandler);

export default app;
