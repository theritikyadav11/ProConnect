import React from "react";
import { FaCheckCircle, FaRegCircle, FaUser } from "react-icons/fa";

const TaskItem = ({ task, onUpdateStatus }) => {
  const handleStatusToggle = () => {
    const newStatus = task.status === "completed" ? "in-progress" : "completed";
    onUpdateStatus(task._id, newStatus);
  };

  return (
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-2 shadow-sm">
      <div className="flex items-center">
        <button
          onClick={handleStatusToggle}
          className="mr-3 text-xl focus:outline-none"
        >
          {task.status === "completed" ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaRegCircle className="text-gray-400" />
          )}
        </button>
        <span
          className={`text-gray-800 ${
            task.status === "completed" ? "line-through text-gray-500" : ""
          }`}
        >
          {task.description}
        </span>
      </div>
      {task.assignedTo && (
        <div className="flex items-center text-sm text-gray-600">
          <FaUser className="mr-1" />
          <span>{task.assignedTo.name}</span>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
