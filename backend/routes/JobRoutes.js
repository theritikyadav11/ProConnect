import express from "express";
import { getJobs, analyzeResume } from "../controllers/JobController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

const upload = multer(); // in-memory

const router = express.Router();

router.get("/jobs", protect, getJobs);
router.post(
  "/jobs/analyze-resume",
  protect,
  upload.single("resume"),
  analyzeResume
);

export default router;
