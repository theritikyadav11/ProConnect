// src/api.js
import axios from "axios";

const API_BASE = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to add the token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ------------------- Auth -------------------
export const registerUser = (data) => api.post("/register", data);
export const loginUser = (data) => api.post("/login", data);

// ------------------- Profile -------------------
export const getUserProfile = () => api.post("/get_user_and_profile");

export const updateUser = (data) => api.post("/user_update", data);

export const updateProfile = (data) => api.post("/update_profile_data", data);

export const updateProfilePicture = (formData) => {
  return api.post("/update_profile_picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateProfileSkills = (data) =>
  api.post("/profile/update_skills", data);

export const updateProfileInterests = (data) =>
  api.post("/profile/update_interests", data);

export const getAllUsers = () => api.get("/user/get_all_users");

export const downloadResume = (id) =>
  api.get(`/user/download_resume?id=${id}`, { responseType: "blob" });

// ------------------- Connections -------------------
export const sendConnectionRequest = (data) =>
  api.post("/user/send_connection_request", data);

export const getConnectionStatusByUserId = (userId) =>
  api.get(`/user/connection_status/${userId}`);

export const getConnectionsRequests = () =>
  api.get("/user/getConnectionsRequest");

export const getMyConnections = () => api.get("/user/user_connection_request");

export const acceptConnectionRequest = (data) =>
  api.post("/user/accept_connection_request", data);

// Invitations (requests sent TO me)
export const whatAreMyConnections = () =>
  api.get("/user/user_connection_request");

// Accepted connections where I am either userId or connectionId
export const getAcceptedConnections = () =>
  api.get("/user/accepted_connections");

// ------------------- Posts -------------------
export const createPost = (formData) => {
  return api.post("/post", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getProfessionalPosts = () => api.get("/posts/professional");
export const getCommunityPosts = () => api.get("/posts/community");
export const getAllPosts = () => api.get("/posts");
export const getFeedPosts = (feedType) =>
  api.get(`/posts/feed`, {
    params: { type: feedType },
  });

export const deletePost = (data) => api.post("/delete_post", data);

export const commentOnPost = (data) => api.post("/comment", data);

export const getCommentsByPost = (post_id) =>
  api.get("/get_comments", { params: { post_id } });

export const deleteComment = (data) =>
  api.delete("/delete_comment", { data: { ...data } });

export const incrementLikes = (post_id) =>
  api.post("/increment_post_like", { post_id });

export const getPostsByUser = () => api.get("/posts/user");

export const getUserProfileById = (userId) => api.get(`/profile/${userId}`);

export const getPostsByUserId = (userId) => api.get(`/posts/user/${userId}`);

// ------------------- Micro Projects -------------------
export const createMicroProject = (data) =>
  api.post("/api/microprojects", data);

export const getMicroProject = (projectId) =>
  api.get(`/api/microprojects/${projectId}`);

export const updateMicroProject = (projectId, data) =>
  api.put(`/api/microprojects/${projectId}`, data);

export const inviteCollaborator = (projectId, collaboratorId) =>
  api.post(`/api/microprojects/${projectId}/invite`, { collaboratorId });

export const acceptCollaboration = (projectId) =>
  api.post(`/api/microprojects/${projectId}/accept`, {});

export const declineCollaboration = (projectId) =>
  api.post(`/api/microprojects/${projectId}/decline`, {});

export const addTaskToProject = (projectId, data) =>
  api.post(`/api/microprojects/${projectId}/tasks`, data);

export const updateProjectTask = (taskId, data) =>
  api.put(`/api/microprojects/tasks/${taskId}`, data);

export const completeMicroProject = (projectId) =>
  api.post(`/api/microprojects/${projectId}/complete`, {});

export const getMicroProjectsByUser = (userId, statusFilter = null) => {
  let url = `/api/microprojects/user/${userId}`;
  if (statusFilter) {
    url += `?status=${statusFilter}`;
  }
  return api.get(url);
};

export const getAchievementsByUser = (userId) =>
  api.get(`/api/microprojects/user/${userId}/achievements`);

// ------------------- Notifications -------------------
export const getNotifications = (userId) =>
  api.get(`/api/notifications/${userId}`);

export const markNotificationAsRead = (notificationId) =>
  api.put(`/api/notifications/${notificationId}/read`, {});

// ------------------- Project Chat (Placeholder) -------------------
// These endpoints need to be implemented on the backend
export const getProjectDiscussion = (projectId) =>
  api.get(`/api/microprojects/${projectId}/discussion`);

export const sendProjectMessage = (projectId, data) =>
  api.post(`/api/microprojects/${projectId}/discussion`, data);

// ------------------- Jobs -------------------
export const getJobs = () => api.get("/api/jobs");
export const analyzeResume = (formData) =>
  api.post("/api/jobs/analyze-resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export default api;
