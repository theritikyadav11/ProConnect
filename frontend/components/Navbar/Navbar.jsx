import { useState, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { useNavigate, useLocation } from "react-router-dom";
import { authAtom } from "../../state/authAtom";

import HomeNavItem from "./HomeNavItem";
import MyConnectionNavItem from "./MyConnectionNavItem";
import DiscoverNavItem from "./DiscoverNavItem";
import ProfileNavItem from "./ProfileNavItem";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const setAuth = useSetRecoilState(authAtom);
  const navigate = useNavigate();
  const location = useLocation();

  // Map routes to nav states
  const routeToTab = {
    "/": "Home",
    "/my-connections": "MyConnections",
    "/discover": "Discover",
    "/profile": "Profile",
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
        <DiscoverNavItem
          active={active === "Discover"}
          onClick={() => handleNav("Discover", "/discover")}
        />
        <ProfileNavItem
          active={active === "Profile"}
          onClick={() => handleNav("Profile", "/profile")}
        />
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
