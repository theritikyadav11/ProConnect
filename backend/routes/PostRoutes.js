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
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.route("/post").post(upload.single("media"), createPost);
router.route("/posts/feed").get(getFeed);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").post(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").get(get_comments_by_post);
router.route("/delete_comment").delete(delete_comment_of_user);
router.route("/increment_post_like").post(increment_likes);
router.route("/posts/user").get(getPostsByUser);
router.route("/posts/user/:userId").get(getPostsByUserId);

export default router;
