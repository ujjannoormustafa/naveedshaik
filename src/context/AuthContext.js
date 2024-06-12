import React, { createContext, useState, useEffect, useContext } from "react";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );
  const [isLoggedIn,setIsLoggedIn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("token", token);
    console.log("userData", userData);
    console.log("auth useEffect: ");
    if(token==="null"){
      console.log("if");
      setIsLoggedIn(false)
      setLoading(false)
    }else{
      console.log("else");
      setIsLoggedIn(true)
      setLoading(false)
    }

  },[])

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
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    
  };

  useEffect(() => {
    
    console.log("isLogoedIN: ",isLoggedIn);
   
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
        loading,
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
