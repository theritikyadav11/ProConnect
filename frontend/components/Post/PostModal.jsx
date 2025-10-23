import { useRecoilValue } from "recoil";
import { authAtom } from "../../state/authAtom";
import { FaSmile, FaImage, FaVideo } from "react-icons/fa";
import { useState } from "react";
import { createPost, getFeedPosts } from "../../services/api";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000";

export default function PostModal({ open, onClose, setPosts }) {
  const auth = useRecoilValue(authAtom);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!open) return null;

  const handleMediaClick = (type) => {
    setMediaType(type);
    document.getElementById(`post-media-input-${type}`).click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // allow posting media without text
    if (!content.trim() && !media) return;

    const formData = new FormData();
    formData.append("body", content || ""); // <-- always append a string
    if (media) {
      formData.append("media", media);
      formData.append("fileType", media.type);
    }

    setSubmitting(true);
    console.log("Auth token before creating post:", auth.token); // Debugging line
    try {
      await createPost(formData);
      // const res = await getFeedPosts();
      // setPosts(res.data.posts);
      onClose();
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
      setContent("");
      setMedia(null);
      setMediaType("");
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 relative">
        {/* Close Button */}
        <button
          className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={auth?.user?.profilePicture || "default.jpg"}
            alt="user"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <span className="font-semibold">{auth?.user?.name}</span>
            <div className="text-xs text-gray-500">Post to Anyone</div>
          </div>
        </div>

        {/* Content Input */}
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full resize-none border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="What do you want to talk about?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={submitting}
          />

          {/* Media Preview */}
          {media && (
            <div className="my-3">
              {mediaType === "image" && (
                <img
                  src={URL.createObjectURL(media)}
                  alt="Preview"
                  className="max-w-full max-h-56 rounded"
                />
              )}
              {mediaType === "video" && (
                <video controls className="max-w-full max-h-56 rounded">
                  <source src={URL.createObjectURL(media)} type="video/mp4" />
                </video>
              )}
            </div>
          )}

          {/* Media/Input bar */}
          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              className="text-2xl text-blue-600"
              onClick={() => handleMediaClick("image")}
            >
              <FaImage />
            </button>
            <input
              id="post-media-input-image"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                setMediaType("image");
                setMedia(e.target.files[0]);
              }}
            />

            <button
              type="button"
              className="text-2xl text-green-600"
              onClick={() => handleMediaClick("video")}
            >
              <FaVideo />
            </button>
            <input
              id="post-media-input-video"
              type="file"
              accept="video/*"
              style={{ display: "none" }}
              onChange={(e) => {
                setMediaType("video");
                setMedia(e.target.files[0]);
              }}
            />

            <span className="text-2xl text-gray-400">
              <FaSmile />
            </span>
          </div>

          {/* Post Button */}
          <div className="mt-4 text-right">
            <button
              type="submit"
              disabled={submitting || (content.trim() === "" && !media)}
              className={`px-6 py-2 rounded-full bg-blue-600 text-white font-semibold transition ${
                submitting || (content.trim() === "" && !media)
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
