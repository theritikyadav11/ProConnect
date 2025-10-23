import { Router } from "express";
import {
  commentPost,
  createPost,
  delete_comment_of_user,
  deletePost,
  get_comments_by_post,
  getAllPosts,
  increment_likes,
  getPostsByUser,
  getPostsByUserId,
  getFeed,
} from "../controllers/PostController.js";
import { protect } from "../middleware/authMiddleware.js"; // Import the protect middleware
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.route("/post").post(upload.single("media"), protect, createPost); // Added protect middleware
router.route("/posts/feed").get(protect, getFeed); // Added protect middleware
router.route("/posts").get(getAllPosts);
router.route("/delete_post").post(protect, deletePost); // Added protect middleware
router.route("/comment").post(protect, commentPost); // Added protect middleware
router.route("/get_comments").get(get_comments_by_post);
router.route("/delete_comment").delete(protect, delete_comment_of_user); // Added protect middleware
router.route("/increment_post_like").post(protect, increment_likes); // Added protect middleware
router.route("/posts/user").get(protect, getPostsByUser); // Added protect middleware
router.route("/posts/user/:userId").get(getPostsByUserId);

export default router;
