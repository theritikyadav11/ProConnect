import { Link } from "react-router-dom";

export default function LandingNavbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600">ProConnect</div>

      {/* Navigation Links */}
      <div className="space-x-4">
        <Link
          to="/login"
          className="px-4 py-2 rounded-md text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
