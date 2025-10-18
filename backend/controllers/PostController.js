import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import { computeFeedScoresForPost } from "../services/feedService.js";
import FeedScore from "../models/FeedScore.js";
import cloudinary from "../services/cloudinary.js";

// export const createPost = async (req, res) => {
//   console.log("req.body:", req.body);
//   console.log("req.file:", req.file);
//   try {
//     const { body } = req.body;

//     // ✅ Validate user using token
//     const user = await User.findOne({ token: req.body.token });
//     if (!user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     // ✅ Create new post (supports uploaded file or base64 media)
//     const newPost = new Post({
//       userId: user._id,
//       body: req.body.body || "",
//       media: req.file ? req.file.filename : req.body.media || "",
//       fileType: req.file ? req.file.mimetype : req.body.fileType || "",
//     });

//     await newPost.save();

//     // ✅ Trigger feed score computation asynchronously (non-blocking)
//     computeFeedScoresForPost(newPost).catch((err) =>
//       console.error("Feed score computation error:", err)
//     );

//     // ✅ Send response
//     return res.status(201).json({
//       message: "Post created successfully",
//       post: newPost,
//     });
//   } catch (error) {
//     console.error("POST /post error:", error);
//     return res.status(500).json({ message: error.message });
//   }
// };

//

export const createPost = async (req, res) => {
  try {
    const { body } = req.body;

    // Validate user using token
    const user = await User.findOne({ token: req.body.token });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Create new post (supports uploaded file or base64 media)
    let mediaUrl = req.body.media || "";
    let fileType = req.body.fileType || "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`,
        {
          folder: "post_media",
          resource_type: "auto", // Automatically detect image/video
        }
      );
      mediaUrl = result.secure_url;
      fileType = req.file.mimetype;
    }

    const newPost = new Post({
      userId: user._id,
      body: req.body.body || "",
      media: mediaUrl,
      fileType: fileType,
    });

    await newPost.save();

    // Trigger feed score computation asynchronously (non-blocking)
    computeFeedScoresForPost(newPost).catch((err) =>
      console.error("Feed score computation error:", err)
    );

    // Send response
    return res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

import dotenv from "dotenv";
dotenv.config();

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name uname email profilePicture"
    );
    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const { type, token } = req.query;

    // Find user by token
    const user = await User.findOne({ token });
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found or unauthorized" });
    }

    const PROFESSIONAL_THRESHOLD = parseInt(
      process.env.PROFESSIONAL_THRESHOLD || "3",
      10
    );

    // Step 1: Find all FeedScores for the current user
    const allFeedScores = await FeedScore.find({ userId: user._id }).select(
      "postId score"
    );

    // Extract IDs of professional-level posts
    const professionalPostIds = allFeedScores
      .filter((fs) => fs.score >= PROFESSIONAL_THRESHOLD)
      .map((fs) => fs.postId);

    let posts;

    if (type === "professional") {
      // Fetch professional posts (those above threshold)
      posts = await Post.find({ _id: { $in: professionalPostIds } })
        .populate("userId", "name uname email profilePicture")
        .sort({ createdAt: -1 })
        .limit(20);
    } else if (type === "community") {
      // Fetch posts not in professional list (below threshold or never scored)
      posts = await Post.find({ _id: { $nin: professionalPostIds } })
        .populate("userId", "name uname email profilePicture")
        .sort({ createdAt: -1 })
        .limit(20);
    } else {
      // Default: return a mix or fallback
      posts = await Post.find({})
        .populate("userId", "name uname email profilePicture")
        .sort({ createdAt: -1 })
        .limit(20);
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getFeed:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;
  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) return res.status(400).json({ message: "User not found" });

    const post = await Post.findOne({ _id: post_id });
    if (!post) return res.status(400).json({ message: "Post not found" });

    if (post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Correct Mongoose method to delete the post document
    await Post.deleteOne({ _id: post_id });

    return res.json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// export const commentPost = async (req, res) => {
//   const { token, post_id, commentBody } = req.body;
//   try {
//     const user = await User.findOne({ token: token }).select("_id");
//     if (!user) return res.status(400).json({ message: "User not found" });

//     const post = await Post.findOne({ _id: post_id });
//     if (!post) return res.status(400).json({ message: "Post not found" });

//     const comment = new Comment({
//       userId: user._id,
//       postId: post._id,
//       comment: commentBody,
//     });

//     await comment.save();

//     return res.status(200).json({ message: "Commented Added" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

export const commentPost = async (req, res) => {
  const { token, post_id, commentBody } = req.body;
  console.log("Request body: ", req.body);
  try {
    const user = await User.findOne({ token }).select(
      "_id name profilePicture"
    );
    if (!user) return res.status(400).json({ message: "User not found" });

    const post = await Post.findById(post_id);
    if (!post) return res.status(400).json({ message: "Post not found" });

    const comment = new Comment({
      userId: user._id,
      postId: post._id,
      body: commentBody,
    });

    await comment.save();

    return res.status(200).json({ message: "Comment Added", comment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// export const get_comments_by_post = async (req, res) => {
//   const { post_id } = req.query;
//   try {
//     const post = await Post.findOne({ _id: post_id });
//     if (!post) return res.status(400).json({ message: "Post not found" });

//     return res.json({ comments: post.comments });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

export const get_comments_by_post = async (req, res) => {
  const { post_id } = req.query;
  try {
    const comments = await Comment.find({ postId: post_id })
      .populate("userId", "name profilePicture")
      .sort({ createdAt: -1 });

    return res.json({ comments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// export const delete_comment_of_user = async (req, res) => {
//   const { token, comment_id } = req.body;
//   try {
//     const user = await User.findOne({ token: token }).select("_id");
//     if (!user) return res.status(400).json({ message: "User not found" });

//     const comment = await Comment.findOne({ _id: comment_id });
//     if (!comment) return res.status(400).json({ message: "Comment not found" });

//     if (comment.userId.toString() !== user._id.toString()) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     await comment.deleteOne({ _id: comment_id });
//     return res.status(200).json({ message: "Comment Deleted successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

export const delete_comment_of_user = async (req, res) => {
  const { token, comment_id } = req.body;
  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) return res.status(400).json({ message: "User not found" });

    const comment = await Comment.findById(comment_id);
    if (!comment) return res.status(400).json({ message: "Comment not found" });

    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await comment.deleteOne();
    return res.status(200).json({ message: "Comment Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// export const increment_likes = async (req, res) => {
//   const { post_id } = req.body;
//   try {
//     const post = await Post.findOne({ _id: post_id });

//     if (!post) return res.status(400).json({ message: "Post not found" });

//     post.likes = post.likes + 1;
//     await post.save();
//     return res.json({ message: "Likes incremented successfully" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

export const increment_likes = async (req, res) => {
  const { post_id } = req.body;
  try {
    const post = await Post.findById(post_id);
    if (!post) return res.status(400).json({ message: "Post not found" });

    post.likes = (post.likes || 0) + 1;
    await post.save();

    return res.json({
      message: "Likes incremented successfully",
      likes: post.likes,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get posts by user token
export const getPostsByUser = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token }).select("_id");
    if (!user) return res.status(400).json({ message: "User not found" });

    const posts = await Post.find({ userId: user._id })
      .populate("userId", "name uname email profilePicture")
      .sort({ createdAt: -1 });
    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get posts by userId (from URL param)
export const getPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId })
      .populate("userId", "name uname email profilePicture")
      .sort({ createdAt: -1 });
    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
