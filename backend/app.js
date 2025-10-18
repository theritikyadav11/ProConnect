import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import "./workers/feedWorkers.js";
import UserRoutes from "./routes/UserRoutes.js";
import PostRoutes from "./routes/PostRoutes.js";

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use(UserRoutes);
app.use(PostRoutes);

async function start() {
  const mongoConnection = await mongoose.connect(process.env.MONGODB_URL);
  console.log("Database connected successfully");
  app.listen(5000, () => {
    console.log("Server is listening on port 8000");
  });
}

start();
