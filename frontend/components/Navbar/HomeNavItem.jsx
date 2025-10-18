import { FaHome } from "react-icons/fa";

export default function HomeNavItem({ active, onClick }) {
  return (
    <button
      className={`flex flex-col items-center mx-2 transition-all focus:outline-none`}
      onClick={onClick}
    >
      <FaHome
        size={20}
        className={active ? "text-blue-600" : "text-gray-700"}
      />
      <span
        className={`text-xs mt-1 ${
          active
            ? "text-blue-600 font-bold border-b-2 border-black"
            : "text-gray-700 font-medium"
        } hidden sm:block`}
      >
        Home
      </span>
    </button>
  );
}
