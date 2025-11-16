import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";
import cors from "cors";
import errorHandler from "./middleware/errorHandler";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Allow specific frontend origin
app.use(cors({
  origin: "http://localhost:3000", // frontend URL
  credentials: true,               // if using cookies/auth
}));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use(errorHandler);

export default app;
