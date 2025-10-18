import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate
import { authAtom } from "../state/authAtom";
import { getUserProfile } from "../services/api";

export default function ProfileSection() {
  const [auth, setAuth] = useRecoilState(authAtom);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate(); // initialize navigate

  useEffect(() => {
    if (auth.token) {
      getUserProfile(auth.token)
        .then((res) => {
          setProfile(res.data);
          setAuth({ ...auth, user: res.data.userId });
        })
        .catch(console.error);
    }
  }, [auth.token]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center">
      <img
        src={profile.userId.profilePicture || "default.jpg"}
        alt="Profile"
        className="w-24 h-24 rounded-full mb-3 object-cover border-2 border-blue-600"
      />
      <h2 className="text-xl font-bold mb-1">{profile.userId.name}</h2>
      {/* <p className="text-gray-500 text-sm mb-2">
        {profile.currentPost || "No current position set"}
      </p> */}
      <p className="text-xs text-gray-400 text-center mb-3">
        {profile.bio || "No bio available"}
      </p>
      <button
        className="mt-4 px-4 py-1 rounded-full bg-blue-600 text-white text-xs hover:bg-blue-700"
        onClick={() => navigate("/profile")} // redirect on click
      >
        Edit Profile
      </button>
    </div>
  );
}
