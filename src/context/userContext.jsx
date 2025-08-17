// UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(false); // default value = false

  // Load token from localStorage after component mounts
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Persist token changes to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Logout helper
  const logout = () => {
    setToken(false);
  };

  return (
    <UserContext.Provider value={{ token, setToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

// // UserContext.jsx
// import { createContext, useContext, useEffect, useState } from "react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [token, setToken] = useState(() => {
//     // Load token from localStorage on first render
//     return localStorage.getItem("token") || false;
//   });

//   // Persist token changes to localStorage
//   useEffect(() => {
//     if (token) {
//       localStorage.setItem("token", token);
//     } else {
//       localStorage.removeItem("token");
//     }
//   }, [token]);

//   // Logout helper
//   const logout = () => {
//     setToken(false);
//   };

//   return (
//     <UserContext.Provider value={{ token, setToken, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);
