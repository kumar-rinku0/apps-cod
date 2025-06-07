import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
// Create Context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const signIn = (userData) => {
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
  };

  const signOut = () => {
    axios
      .get("/api/user/logout")
      .then((res) => {
        navigate("/");
        setTimeout(() => {
          setUser(null);
          setIsAuthenticated(false);
        }, 200);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios.get("/api").then((res) => {
      console.log(res.data.user);
      signIn(res.data.user);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
