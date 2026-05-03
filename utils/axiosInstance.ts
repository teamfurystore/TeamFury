import axios, { AxiosError } from "axios";

/**
 * Shared axios instance for all internal API calls.
 *
 * baseURL:
 *   - Browser: empty string → relative URLs resolve against window.location
 *   - Server-side (SSR/RSC): should not be used — these thunks are client-only
 *
 * withCredentials: true → sends the sb-access-token cookie automatically
 * on every request so admin endpoints can verify the session.
 */
const axiosInstance = axios.create({
  baseURL: typeof window !== "undefined" ? "" : "http://localhost:3000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// ── Response interceptor ──────────────────────────────────────────────────────

axiosInstance.interceptors.response.use(
  // Pass through successful responses unchanged
  (response) => response,

  // Handle errors globally
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Session expired or missing — redirect to admin login
      // Only redirect if we're in the browser and on an admin page
      if (
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/admin")
      ) {
        // Clear the stale cookie
        document.cookie = "sb-access-token=; path=/; max-age=0";
        window.location.href = "/admin";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
