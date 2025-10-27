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
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 flex flex-col items-center text-white transform transition-all duration-300 hover:scale-105">
      <img
        src={profile.userId.profilePicture || "default.jpg"}
        alt="Profile"
        className="w-28 h-28 rounded-full mb-4 object-cover border-4 border-white shadow-md"
      />
      <h2 className="text-2xl font-extrabold mb-1 text-shadow-sm">
        {profile.userId.name}
      </h2>
      <p className="text-sm opacity-90 text-center mb-4">
        {profile.bio || "No bio available"}
      </p>
      <div className="flex flex-col space-y-3 w-full px-4">
        <button
          className="w-full py-2 rounded-full bg-white text-blue-600 font-semibold text-sm hover:bg-gray-100 transition-colors duration-200 shadow-md"
          onClick={() => navigate("/profile")}
        >
          Edit Profile
        </button>
        <button
          className="w-full py-2 rounded-full bg-white text-blue-600 font-semibold text-sm hover:bg-gray-100 transition-colors duration-200 shadow-md"
          onClick={() => navigate("/jobs")}
        >
          Jobs Section
        </button>
        <button
          className="w-full py-2 rounded-full bg-white text-blue-600 font-semibold text-sm hover:bg-gray-100 transition-colors duration-200 shadow-md"
          onClick={() => navigate("/create-microproject")}
        >
          Micro-Project Section
        </button>
      </div>
    </div>
  );
}
