import React from "react";
import { deleteComment } from "../../services/api";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../state/authAtom";

export default function CommentList({ comments, onDelete }) {
  const auth = useRecoilValue(authAtom);

  const handleDelete = async (id) => {
    await deleteComment({ comment_id: id }, auth.token);
    onDelete(id);
  };

  return (
    <div className="mt-2 space-y-2">
      {comments.map((c) => (
        <div key={c._id} className="flex items-center gap-2">
          <img
            src={c.userId?.profilePicture || "/default.jpg"}
            alt="user"
            className="w-7 h-7 rounded-full object-cover"
          />
          <div className="bg-gray-100 rounded-full px-4 py-2 flex-1">
            <span className="font-semibold mr-2">{c.userId?.name}</span>
            <span className="text-xs text-gray-700">{c.body}</span>
          </div>
          {c.userId?._id === auth.user?._id && (
            <button
              onClick={() => handleDelete(c._id)}
              className="text-red-500 text-xs ml-2"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
