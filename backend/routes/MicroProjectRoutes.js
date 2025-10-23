import express from "express";
import {
  createMicroProject,
  getMicroProject,
  updateMicroProject,
  inviteCollaborator,
  acceptCollaboration,
  declineCollaboration,
  addTask,
  updateTask,
  completeMicroProject,
  getUserMicroProjects,
  getUserAchievements,
  getProjectDiscussion,
  sendProjectMessage,
} from "../controllers/MicroProjectController.js";
import { protect } from "../middleware/authMiddleware.js"; // Assuming you have an auth middleware

const router = express.Router();

router.route("/").post(protect, createMicroProject);

router
  .route("/:id")
  .get(protect, getMicroProject)
  .put(protect, updateMicroProject);

router.post("/:id/invite", protect, inviteCollaborator);
router.post("/:id/accept", protect, acceptCollaboration);
router.post("/:id/decline", protect, declineCollaboration);
router.post("/:id/tasks", protect, addTask);
router.put("/tasks/:id", protect, updateTask);
router.post("/:id/complete", protect, completeMicroProject);
router.get("/user/:userId", protect, getUserMicroProjects);
router.get("/user/:userId/achievements", protect, getUserAchievements);

// Discussion/Chat routes
router
  .route("/:id/discussion")
  .get(protect, getProjectDiscussion)
  .post(protect, sendProjectMessage);

export default router;
