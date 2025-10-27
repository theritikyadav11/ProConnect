import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "./.env") });
import cors from "cors";
import "./workers/feedWorkers.js";
import UserRoutes from "./routes/UserRoutes.js";
import PostRoutes from "./routes/PostRoutes.js";
import MicroProjectRoutes from "./routes/MicroProjectRoutes.js"; // Import new routes
import JobRoutes from "./routes/JobRoutes.js"; // Import Job routes

const app = express();

//middleware
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Increased limit for JSON payloads
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Increased limit for URL-encoded payloads

//routes
app.use(UserRoutes);
app.use(PostRoutes);
app.use("/api/microprojects", MicroProjectRoutes); // Use new routes with a base path
app.use("/api", JobRoutes); // Use Job routes with a base path

async function start() {
  const mongoConnection = await mongoose.connect(process.env.MONGODB_URL);
  console.log("Database connected successfully");
  const PORT = process.env.PORT || 5000; // Use PORT from .env or default to 5000
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

start();
