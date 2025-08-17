// src/api/users.js
import { useApi } from "./api";

export const useUserApi = () => {
  const api = useApi();

  return {
    getProfile: () => api.get("/profile"),
    updateProfile: (data) => api.put("/profile", data),
    deleteAccount: () => api.delete("/profile"),
  };
};
