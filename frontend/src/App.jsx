import { Routes, Route } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authAtom } from "../state/authAtom";
import { getUserProfile } from "../services/api";
import { useEffect } from "react";

import LandingNavbar from "../components/Navbar/LandingNavbar";
import Landing from "../components/Landing/Landing";
import Navbar from "../components/Navbar/Navbar";

// Page Components
import HomePage from "../pages/Home";
import MyConnectionsPage from "../pages/MyConnection";
import DiscoverPage from "../pages/Discover";
import ProfilePage from "../pages/Profile";
import UserProfilePage from "../pages/UserProfile";
import Login from "../pages/Login";
import Register from "../pages/Register";

export default function App() {
  const auth = useRecoilValue(authAtom);
  const setAuth = useSetRecoilState(authAtom);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !auth?.token) {
      setAuth({ token, user: null });
      getUserProfile(token)
        .then((res) => {
          const user = res.data?.user ?? res.data;
          setAuth({ token, user });
        })
        .catch((err) => {
          console.error("profile fetch failed:", err);
        });
    }
  }, [auth?.token, setAuth]);

  if (!auth?.token) {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-white">
              <LandingNavbar />
              <Landing />
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/my-connections" element={<MyConnectionsPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </div>
  );
}
