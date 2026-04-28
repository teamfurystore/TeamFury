import axios from "axios";

// Shared axios instance — sends cookies automatically (for admin auth)
const axiosInstance = axios.create({
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
