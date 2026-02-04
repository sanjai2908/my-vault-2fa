import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Configure axios with base URL
axios.defaults.baseURL = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set axios default header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
    setLoading(false);
  }, [token]);

  // Get user profile when token is available
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/user/profile");
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError(err.response?.data?.message || "Failed to fetch profile");
      // If unauthorized, clear token
      if (err.response?.status === 401) {
        setToken(null);
      }
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("/auth/register", {
        name,
        email,
        password,
      });
      if (response.data.token) {
        setToken(response.data.token);
        setUser(response.data.user);
      }
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("/auth/login", {
        email,
        password,
      });
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError(null);
  };

  const updateProfile = async (updatedData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put("/user/profile", updatedData);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Update failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put("/user/change-password", {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Password change failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("/auth/forgot-password", { email });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Request failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Reset failed";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
