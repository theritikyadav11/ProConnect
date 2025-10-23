import { Router } from "express";
import multer from "multer";
import {
  registerUser,
  loginUser,
  updateProfilePicture,
  updateUserProfile,
  getUserAndProfile,
  updateProfileData,
  getAllUserProfile,
  downloadProfile,
  sendConnectionRequest,
  getMyConnectionsRequest,
  whatAreMyConnections,
  acceptConnectionRequest,
  getProfileByUserId,
  getConnectionStatusByUserId,
  getAcceptedConnections,
  updateProfileInterests,
  updateProfileSkills,
} from "../controllers/UserController.js";
import { protect } from "../middleware/authMiddleware.js"; // Import protect middleware

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router
  .route("/update_profile_picture")
  .post(protect, upload.single("profile_picture"), updateProfilePicture);

router.route("/user_update").post(protect, updateUserProfile);
router.route("/get_user_and_profile").post(protect, getUserAndProfile);
router.route("/update_profile_data").post(protect, updateProfileData);
router.route("/user/get_all_users").get(protect, getAllUserProfile); // Apply protect middleware
router.route("/user/download_resume").get(protect, downloadProfile);
router
  .route("/user/send_connection_request")
  .post(protect, sendConnectionRequest);
router
  .route("/user/getConnectionsRequest")
  .get(protect, getMyConnectionsRequest);
router
  .route("/user/user_connection_request")
  .get(protect, whatAreMyConnections);
router
  .route("/user/accept_connection_request")
  .post(protect, acceptConnectionRequest);
router
  .route("/user/connection_status/:userId")
  .get(protect, getConnectionStatusByUserId);

router.route("/user/accepted_connections").get(protect, getAcceptedConnections);

router.route("/profile/:userId").get(protect, getProfileByUserId);

router.route("/profile/update_skills").post(protect, updateProfileSkills);
router.route("/profile/update_interests").post(protect, updateProfileInterests);

export default router;
