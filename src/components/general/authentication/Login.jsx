import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Icon from "@mdi/react";
import { useNavigate, Link,useLocation,useHistory } from "react-router-dom";
import { mdiAccount, mdiLock, mdiEyeOutline, mdiEyeOffOutline } from "@mdi/js";
import { BASE_URL } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import Logo from "../../../resources/images/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location?.state?.message;
  const path = location.state?.from;

  console.log("message: ",message);
  // if(location?.state?.message){
  //   toast.error(message, {
  //     position: "top-right",
  //     autoClose: 1000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //   });
  // }
  const { login } = useAuth();


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  console.log(path);
  const handleInputChange = (e) => {
    if (e.target.name === "username") {
      setUsername(e.target.value);
    } else if (e.target.name === "password") {
      setPassword(e.target.value);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        login(responseData.data, responseData.user);
        toast.success("Login Successfully", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if(path !== undefined) {
          console.log("path: ",path);
          navigate(path, { replace: true });
          return;

        }
        if (responseData.user.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/user", { replace: true });
        }
      } else {
        handleErrorResponse(response.status);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleErrorResponse = (status) => {
    let errorMessage = "";
    switch (status) {
      case 400:
        errorMessage = "Both username and password are required";
        break;
      case 401:
        errorMessage = "Invalid username or password";
        break;
      case 404:
        errorMessage = "User not found";
        break;
      default:
        errorMessage = "An error occurred. Please try again later.";
    }

    setError(errorMessage);

    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-w-screen min-h-screen bg-white flex items-center justify-center px-5 py-5">
      <div
        className="bg-black rounded-3xl shadow-xl w-full overflow-hidden text-white"
        style={{ maxWidth: 1000 }}
      >
        <div className="md:flex w-full">
          <div className="hidden md:flex items-center justify-center w-1/2 bg-black py-10 px-10">
            <img src={Logo} alt="Pic" />
          </div>
          <div className="w-full md:w-1/2 py-10 px-5 md:px-10 bg-black">
            <div className="text-center mb-10">
              <h1 className="font-bold text-3xl text-white">LOGIN</h1>
              <p className="text-white">Enter your information to Login</p>
              {location?.state?.message && (
                <div className="mt-2 text-red-500">
                  {location?.state?.message}
                </div>
              )}
            </div>
            <div>
              <div className="flex flex-col mb-5">
                <label className="text-xs font-semibold text-white">
                  Username
                </label>
                <div className="flex p-2 items-center bg-white rounded-lg">
                  <Icon
                    path={mdiAccount}
                    title="User Profile"
                    size={1}
                    color="black"
                    className="mr-1"
                  />
                  <input
                    type="email"
                    className="w-full p-2 text-black focus:border-none rounded-lg outline-none"
                    placeholder="Phone | Email"
                    name="username"
                    value={username}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>
              <div className="flex flex-col mb-12">
                <label className="text-xs font-semibold text-white">
                  Password
                </label>
                <div className="flex items-center bg-white rounded-lg p-2">
                  <Icon
                    path={mdiLock}
                    title="User Profile"
                    size={1}
                    color="black"
                    className="mr-1"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full p-2 text-black rounded-lg outline-none"
                    placeholder="Password"
                    name="password"
                    required
                    value={password}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                  />
                  <div
                    className="cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    <Icon
                      path={showPassword ? mdiEyeOffOutline : mdiEyeOutline}
                      title="Toggle Password"
                      size={1}
                      color="black"
                    />
                  </div>
                </div>
                <div className="text-right mt-2">
                  <Link to="/auth/reset-password" className="text-sm text-white underline">
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <div className="flex">
                <button
                  onClick={handleLogin}
                  className="w-full max-w-xs mx-auto bg-white hover:scale-110 transition-all duration-500 text-black rounded-full px-3 py-3 font-semibold"
                >
                  Login
                </button>
              </div>
              <p className="text-white pt-4">
                Don't have an account{" "}
                <a href="/register" className="font-semibold underline">
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
