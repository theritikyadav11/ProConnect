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

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router
  .route("/update_profile_picture")
  .post(upload.single("profile_picture"), updateProfilePicture);

router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").post(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/user/get_all_users").get(getAllUserProfile);
router.route("/user/download_resume").get(downloadProfile);
router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/getConnectionsRequest").get(getMyConnectionsRequest);
router.route("/user/user_connection_request").get(whatAreMyConnections);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);
router
  .route("/user/connection_status/:userId")
  .get(getConnectionStatusByUserId);

router.route("/user/accepted_connections").get(getAcceptedConnections);

router.route("/profile/:userId").get(getProfileByUserId);

router.route("/profile/update_skills").post(updateProfileSkills);
router.route("/profile/update_interests").post(updateProfileInterests);

export default router;
