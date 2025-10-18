import { FaCompass } from "react-icons/fa";

export default function DiscoverNavItem({ active, onClick }) {
  return (
    <button
      className="flex flex-col items-center mx-3 focus:outline-none"
      onClick={onClick}
    >
      <FaCompass
        className={`text-gray-700 ${
          active ? "text-blue-600" : ""
        } transition-all`}
        size={22}
      />
      <span
        className={`text-xs mt-1 hidden sm:block ${
          active
            ? "font-bold text-blue-600 border-b-2 border-black"
            : "font-medium"
        }`}
      >
        Discover
      </span>
    </button>
  );
}
