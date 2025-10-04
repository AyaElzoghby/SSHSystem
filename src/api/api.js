// src/api/api.js
import { useUser } from "../context/UserContext";

const BASE_URL = "https://localhost:7014/api"; // هيوصل للـ public/api
// const BASE_URL = "http://dev1ebtkar-001-site1.atempurl.com/api"; 

// Generic request function
const request = async (method, endpoint, data, token) => {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    if (data && method !== "GET") {
      // GET requests مش بيبقى ليها body
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API ${method} error:`, error);
    throw error;
  }
};

// Hook-based API wrapper that reads token automatically
export const API = () => {
  const { token } = useUser();

  return {
    get: (endpoint, { params } = {}) => {
      let finalEndpoint = endpoint;

      // ✅ لو فيه params، نضيفهم كـ query string
      if (params && Object.keys(params).length > 0) {
        const query = new URLSearchParams(params).toString();
        finalEndpoint += `?${query}`;
      }

      return request("GET", finalEndpoint, null, token);
    },

    post: (endpoint, data) => request("POST", endpoint, data, token),
    put: (endpoint, data) => request("PUT", endpoint, data, token),
    delete: (endpoint) => request("DELETE", endpoint, null, token),
  };
};
