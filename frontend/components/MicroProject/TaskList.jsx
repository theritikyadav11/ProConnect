import React, { useState } from "react";
import TaskItem from "./TaskItem";
import api from "../../services/api";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../state/authAtom";

const TaskList = ({ projectId, tasks, onTaskUpdate }) => {
  const auth = useRecoilValue(authAtom);
  const currentUser = auth.user;
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskDescription.trim()) return;

    setLoading(true);
    setError("");
    try {
      await api.post(`/api/microprojects/${projectId}/tasks`, {
        description: newTaskDescription,
        assignedTo: currentUser._id, // Assign to current user by default
      });
      setNewTaskDescription("");
      onTaskUpdate(); // Trigger a refresh of the project details in parent component
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add task.");
      console.error("Error adding task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    setLoading(true);
    setError("");
    try {
      await api.put(`/api/microprojects/tasks/${taskId}`, {
        status: newStatus,
      });
      onTaskUpdate(); // Trigger a refresh
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task status.");
      console.error("Error updating task status:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleAddTask} className="mb-4">
        <input
          type="text"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder="Add a new task..."
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
          disabled={loading}
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="text-gray-600">No tasks yet. Add one to get started!</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onUpdateStatus={handleUpdateTaskStatus}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
