import { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { useNavigate, useLocation } from "react-router-dom";
import { authAtom } from "../../state/authAtom";

import HomeNavItem from "./HomeNavItem";
import MyConnectionNavItem from "./MyConnectionNavItem";
import ProfileNavItem from "./ProfileNavItem";
import JobsNavItem from "./JobsNavItem";
import SearchBar from "./SearchBar";
import { FaPlusCircle } from "react-icons/fa";

export default function Navbar() {
  const setAuth = useSetRecoilState(authAtom);
  const navigate = useNavigate();
  const location = useLocation();

  // Map routes to nav states
  const routeToTab = {
    "/": "Home",
    "/my-connections": "MyConnections",
    "/jobs": "Jobs",
    "/profile": "Profile",
    "/create-microproject": "CreateMicroProject", // Add new route
  };

  const [active, setActive] = useState(routeToTab[location.pathname] || "Home");

  // Update active tab when route changes
  useEffect(() => {
    setActive(routeToTab[location.pathname] || "Home");
  }, [location.pathname]);

  // Navigation handlers
  function handleNav(name, path) {
    setActive(name);
    navigate(path);
  }

  // Logout handler
  function handleLogout() {
    localStorage.removeItem("token");
    setAuth({ token: null, user: null });
    navigate("/");
  }

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 py-2 bg-white shadow fixed top-0 left-0 right-0 z-10">
      {/* Logo & SearchBox */}
      <div className="flex items-center">
        <span className="font-bold text-xl text-blue-600 mr-4">ProConnect</span>
        <span className="hidden md:block">
          <SearchBar />
        </span>
      </div>

      {/* Center Navigation Items */}
      <div className="flex items-center justify-center mx-auto">
        <HomeNavItem
          active={active === "Home"}
          onClick={() => handleNav("Home", "/")}
        />
        <MyConnectionNavItem
          active={active === "MyConnections"}
          onClick={() => handleNav("MyConnections", "/my-connections")}
        />
        <JobsNavItem
          active={active === "Jobs"}
          onClick={() => handleNav("Jobs", "/jobs")}
        />
        <ProfileNavItem
          active={active === "Profile"}
          onClick={() => handleNav("Profile", "/profile")}
        />
        {/* New Micro Project Button */}
        <button
          onClick={() =>
            handleNav("CreateMicroProject", "/create-microproject")
          }
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
            active === "CreateMicroProject"
              ? "bg-blue-500 text-white"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FaPlusCircle className="mr-1" />
          New Project
        </button>
      </div>

      {/* Logout Button */}
      <div>
        <button
          onClick={handleLogout}
          className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
        >
          Signout
        </button>
      </div>
    </nav>
  );
}
