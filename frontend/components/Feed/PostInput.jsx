import { useState } from "react";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../state/authAtom";
import {
  createPost,
  getProfessionalPosts,
  getCommunityPosts,
} from "../../services/api";

export default function PostInput({ feedType, setPosts }) {
  const auth = useRecoilValue(authAtom);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content && !media) return;

    const formData = new FormData();
    formData.append("token", auth.token);
    formData.append("body", content);
    formData.append("feedType", feedType);
    if (media) {
      formData.append("media", media);
    }

    setSubmitting(true);
    try {
      await createPost(formData);
      setContent("");
      setMedia(null);
      const fetchPosts =
        feedType === "professional" ? getProfessionalPosts : getCommunityPosts;
      const res = await fetchPosts();
      setPosts(res.data.posts);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow flex flex-col md:flex-row items-start gap-4 p-4 mb-6"
    >
      <img
        src={`/uploads/${auth?.user?.profilePicture || "default.jpg"}`}
        alt="user"
        className="w-12 h-12 rounded-full object-cover"
      />
      <textarea
        className="w-full resize-none border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="2"
        placeholder="Start a post"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={submitting}
      />
      <div className="mt-2 flex gap-2 items-center">
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setMedia(e.target.files[0])}
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
