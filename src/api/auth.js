// src/api/auth.js
import { useApi } from "./api";
import { useUser } from "../context/UserContext";

export const useAuthApi = () => {
  const api = useApi();
  const { setToken, logout } = useUser();

  return {
    login: async (credentials) => {
      // Example: { email: "test@example.com", password: "123456" }
      const res = await api.post("/login", credentials);
      if (res.token) {
        setToken(res.token); // Save token to context automatically
      }
      return res;
    },

    register: (data) => api.post("/register", data),

    logoutUser: () => {
      logout(); // Clear token from context
    },
  };
};
