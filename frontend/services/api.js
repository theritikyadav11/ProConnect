// src/api.js
import axios from "axios";

const API_BASE = "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ------------------- Auth -------------------
export const registerUser = (data) => api.post("/register", data);
export const loginUser = (data) => api.post("/login", data);

// ------------------- Profile -------------------
export const getUserProfile = (token) =>
  api.post("/get_user_and_profile", { token });

export const updateUser = (data, token) =>
  api.post("/user_update", { token, ...data });

export const updateProfile = (data, token) =>
  api.post("/update_profile_data", { token, ...data });

export const updateProfilePicture = (formData, token) => {
  formData.append("token", token);
  return api.post("/update_profile_picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateProfileSkills = (data, token) =>
  api.post("/profile/update_skills", { token, ...data });

export const updateProfileInterests = (data, token) =>
  api.post("/profile/update_interests", { token, ...data });

export const getAllUsers = () => api.get("/user/get_all_users");

export const downloadResume = (id) =>
  api.get(`/user/download_resume?id=${id}`, { responseType: "blob" });

// ------------------- Connections -------------------
export const sendConnectionRequest = (data, token) =>
  api.post("/user/send_connection_request", { token, ...data });

export const getConnectionStatusByUserId = (userId, token) =>
  api.get(`/user/connection_status/${userId}`, { params: { token } });

// export const getConnectionsRequests = (token) =>
//   api.get("/user/getConnectionsRequest", { params: { token } });

// export const getIncomingRequests = (token) =>
//   api.get("/user/user_connection_request", { params: { token } });

// export const acceptConnectionRequest = (data, token) =>
//   api.post("/user/accept_connection_request", { token, ...data });

export const getConnectionsRequests = (token) =>
  api.get("/user/getConnectionsRequest", { params: { token } });

export const getMyConnections = (token) =>
  api.get("/user/user_connection_request", { params: { token } });

export const acceptConnectionRequest = (data) =>
  api.post("/user/accept_connection_request", data);

// Invitations (requests sent TO me)
export const whatAreMyConnections = (token) =>
  api.get("/user/user_connection_request", { params: { token } });

// Accepted connections where I am either userId or connectionId
export const getAcceptedConnections = (token) =>
  api.get("/user/accepted_connections", { params: { token } });

// export const acceptConnectionRequest = (data) =>
//   api.post("/user/accept_connection_request", data);

// ------------------- Posts -------------------
// export const createPost = (formData, token) => {
//   formData.append("token", token);
//   return api.post("/post", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
// };

export const createPost = (formData, token) => {
  // token is already appended to formData in PostModal, no need to append again
  return api.post("/post", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getProfessionalPosts = () => api.get("/posts/professional");
export const getCommunityPosts = () => api.get("/posts/community");
export const getAllPosts = () => api.get("/posts");
export const getFeedPosts = (feedType, token) =>
  api.get(`/posts/feed`, {
    params: { type: feedType, token },
  });

export const deletePost = (data, token) =>
  api.post("/delete_post", { token, ...data });

export const commentOnPost = (data, token) =>
  api.post("/comment", { token, ...data });

export const getCommentsByPost = (post_id) =>
  api.get("/get_comments", { params: { post_id } });

export const deleteComment = (data, token) =>
  api.delete("/delete_comment", { data: { token, ...data } });

export const incrementLikes = (post_id) =>
  api.post("/increment_post_like", { post_id });

export const getPostsByUser = (token) =>
  api.get("/posts/user", { params: { token } });

export const getUserProfileById = (userId, token) =>
  api.get(`/profile/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getPostsByUserId = (userId, token) =>
  api.get(`/posts/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export default api;
