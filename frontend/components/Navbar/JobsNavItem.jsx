import { Briefcase } from "lucide-react";

export default function JobsNavItem({ active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
        active ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
      }`}
    >
      <Briefcase className="mr-1" size={18} />
      Jobs
    </button>
  );
}
