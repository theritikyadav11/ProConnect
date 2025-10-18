import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { authAtom } from "../../state/authAtom";
import {
  incrementLikes,
  commentOnPost,
  getCommentsByPost,
} from "../../services/api";
import { FaRegThumbsUp, FaRegCommentDots, FaEllipsisV } from "react-icons/fa";
import CommentList from "./CommentList";

export default function PostCard({ post, onDelete }) {
  const auth = useRecoilValue(authAtom);
  const navigate = useNavigate();
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      setCommentLoading(true);
      try {
        const res = await getCommentsByPost(post._id);
        setComments(res.data.comments || []);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      } finally {
        setCommentLoading(false);
      }
    }
    fetchComments();
  }, [post._id]);

  useEffect(() => {
    const userLikeKey = `postlike_${auth.user?._id}_${post._id}`;
    setLiked(localStorage.getItem(userLikeKey) === "true");
  }, [auth.user, post._id]);

  const handleLike = async () => {
    if (liked) return;
    setLikes((prev) => prev + 1);
    setLiked(true);
    const userLikeKey = `postlike_${auth.user?._id}_${post._id}`;
    localStorage.setItem(userLikeKey, "true");
    await incrementLikes(post._id);
  };

  const handleCommentToggle = () => {
    setShowComments((c) => !c);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    try {
      await commentOnPost({ post_id: post._id, commentBody }, auth.token);
      setCommentBody("");
      const res = await getCommentsByPost(post._id);
      setComments(res.data.comments || []);
      setShowComments(true);
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  // Logic for routing to correct profile based on user
  const isOwnPost = post.userId?._id === auth.user?._id;
  const handleProfileClick = () => {
    if (isOwnPost) navigate("/profile");
    else navigate(`/profile/${post.userId?._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 max-w-xl mx-auto relative">
      {onDelete && isOwnPost && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Options"
          >
            <FaEllipsisV />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-10 mt-2 w-24 rounded-md border bg-white shadow-lg">
              <button
                onClick={() => {
                  onDelete(post._id);
                  setMenuOpen(false);
                }}
                className="block w-full rounded-md px-4 py-2 text-left text-red-600 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 mb-2">
        <img
          src={post.userId?.profilePicture || "default.jpg"}
          alt={post.userId?.name}
          className="w-10 h-10 cursor-pointer rounded-full object-cover hover:ring-2 hover:ring-blue-600"
          onClick={handleProfileClick}
        />
        <div>
          <span
            className="cursor-pointer font-semibold hover:underline"
            onClick={handleProfileClick}
          >
            {post.userId?.name || "User"}
          </span>
          <div className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <p className="my-2 text-base">{post.body}</p>
      {post.media && (
        <div className="mb-3 mt-2">
          {post.fileType?.startsWith("image") ? (
            <img
              src={post.media}
              alt="Post"
              className="max-h-80 w-full rounded-lg object-contain"
            />
          ) : post.fileType?.startsWith("video") ? (
            <video controls className="max-h-80 w-full rounded-lg">
              <source src={post.media} type={post.fileType} />
            </video>
          ) : null}
        </div>
      )}

      <hr className="my-3" />
      <div className="flex items-center gap-8 text-base text-gray-600">
        <button
          onClick={handleLike}
          disabled={liked}
          className={`flex items-center gap-2 ${
            liked ? "cursor-not-allowed text-blue-600" : "hover:text-blue-600"
          }`}
        >
          <FaRegThumbsUp /> {likes} Like
        </button>
        <button
          onClick={handleCommentToggle}
          className="flex items-center gap-2 hover:text-blue-600"
        >
          <FaRegCommentDots /> {comments.length} Comment
        </button>
      </div>

      {showComments && (
        <>
          <form className="flex gap-2 mt-3" onSubmit={handleCommentSubmit}>
            <img
              src={auth.user?.profilePicture || "default.jpg"}
              alt="user"
              className="h-8 w-8 rounded-full object-cover"
            />
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentBody}
              className="flex-grow rounded-full border px-4 py-2 focus:outline-none"
              onChange={(e) => setCommentBody(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-full bg-blue-600 px-4 py-1 text-white font-semibold hover:bg-blue-700"
            >
              Send
            </button>
          </form>
          {commentLoading && (
            <div className="py-2 text-center text-sm text-gray-400">
              Loading comments...
            </div>
          )}
          {!commentLoading && comments.length > 0 && (
            <CommentList
              comments={comments}
              onDelete={(id) =>
                setComments((prev) => prev.filter((c) => c._id !== id))
              }
            />
          )}
        </>
      )}
    </div>
  );
}
