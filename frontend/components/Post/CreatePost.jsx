import { useRecoilValue } from "recoil";
import { authAtom } from "../../state/authAtom";
import { FaVideo, FaImage, FaFileAlt } from "react-icons/fa";

export default function CreatePost({ onOpen }) {
  const auth = useRecoilValue(authAtom);

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 mb-4">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onOpen}>
        <img
          src={auth?.user?.profilePicture || "/default.jpg"}
          alt="user"
          className="w-10 h-10 rounded-full object-cover"
        />
        <input
          readOnly
          className="flex-grow px-4 py-2 border border-gray-300 rounded-full bg-gray-50 cursor-pointer"
          placeholder="Start a post"
          onClick={onOpen}
        />
      </div>
      {/* Add gap between media buttons */}
      <div className="flex gap-4 pt-2 justify-center">
        <button
          type="button"
          className="flex items-center gap-2 text-green-600 font-medium"
          onClick={onOpen}
        >
          <FaVideo className="w-5 h-5" /> Video
        </button>
        <button
          type="button"
          className="flex items-center gap-2 text-blue-600 font-medium"
          onClick={onOpen}
        >
          <FaImage className="w-5 h-5" /> Photo
        </button>
        <button
          type="button"
          className="flex items-center gap-2 text-orange-600 font-medium"
          onClick={onOpen}
        >
          <FaFileAlt className="w-5 h-5" /> Write article
        </button>
      </div>
    </div>
  );
}
