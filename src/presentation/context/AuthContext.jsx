import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const LOCAL_STORAGE_KEY = "traffic_news_role";
const DEFAULT_MANAGER_PASSCODE = import.meta.env.VITE_MANAGER_PASSCODE || "traffic-admin";

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    if (typeof window === "undefined") {
      return "public";
    }
    return localStorage.getItem(LOCAL_STORAGE_KEY) || "public";
  });

  const login = (passcode) => {
    if (!passcode) {
      return { success: false, error: "Passcode required" };
    }
    if (passcode.trim() !== DEFAULT_MANAGER_PASSCODE) {
      return { success: false, error: "Invalid passcode" };
    }
    setRole("manager");
    localStorage.setItem(LOCAL_STORAGE_KEY, "manager");
    return { success: true };
  };

  const logout = () => {
    setRole("public");
    localStorage.setItem(LOCAL_STORAGE_KEY, "public");
  };

  const value = useMemo(
    () => ({ role, isManager: role === "manager", login, logout }),
    [role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
