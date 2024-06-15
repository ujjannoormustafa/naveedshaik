import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );
  
  // console.log(localStorage.getItem( JSON.parse(localStorage.getItem("userData"))));
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("token", token);
    console.log("userData", userData);
    console.log("auth useEffect: ");
    if (!token || token === "null") {
      console.log("if");
      setIsLoggedIn(false);
      setLoading(false);
    } else {
      console.log("else");
      setIsLoggedIn(true);
      setLoading(false);
    }
  }, [token]);

  const login = (newToken, newUser) => {
    setIsLoggedIn(true);
    setToken(newToken);
    setUserData(newUser);
    localStorage.setItem("token", newToken);
    if (newUser != undefined) {
      localStorage.setItem("userData", JSON.stringify(newUser));
    }
  };
const insertUserData = (userData) => {
  setUserData(userData);
  localStorage.setItem("userData", JSON.stringify(userData));
}
  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUserData(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userData");

  };

  useEffect(() => {
    console.log("isLoggedIn: ", isLoggedIn);

    // Update localStorage when token, userData, or cartData changes
    localStorage.setItem("token", token);
    if (userData != undefined) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [token, userData, isLoggedIn]);

  // Provide a default value for cartData if it's null or undefined
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        userData,
        loading,
        login,
        logout,
        insertUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
