import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Auto attach the token in every request to backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle token or common errors
axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Usually { success: true, data: ... }
  },
  (error) => {
    // Check if error response exists
    if (error.response) {
      // Return the error data from the server
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  },
);

// We'll also need a way to set Bearer token if we are using it
export const setAuthToken = (token) => {
  if (token) {
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosClient.defaults.headers.common["Authorization"];
  }
};

export default axiosClient;
