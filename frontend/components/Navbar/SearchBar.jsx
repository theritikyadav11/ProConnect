import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  return (
    <div className="relative w-40">
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search"
        className="pl-10 pr-3 py-1.5 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full transition-all"
      />
    </div>
  );
}
