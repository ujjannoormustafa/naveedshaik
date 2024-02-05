import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(token ? true : false);

  const login = (newToken, newUser) => {
    setIsLoggedIn(true);
    setToken(newToken);
    setUserData(newUser);
    localStorage.setItem("token", newToken);
    if (userData != undefined) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUserData(null);
  };

  useEffect(() => {
    // Update localStorage when token, userData, or cartData changes
    localStorage.setItem("token", token);
    if (userData != undefined) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [token, userData]);

  // Provide a default value for cartData if it's null or undefined
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        userData,

        login,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
