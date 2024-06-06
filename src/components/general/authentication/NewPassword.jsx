import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Icon from "@mdi/react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { mdiLock, mdiEyeOutline, mdiEyeOffOutline } from "@mdi/js";
import { BASE_URL } from "../../../services/api";
import Logo from "../../../resources/images/logo.png";

const NewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailAddress = location.state?.emailAddress || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    if (e.target.name === "newPassword") {
      setNewPassword(e.target.value);
    } else if (e.target.name === "confirmPassword") {
      setConfirmPassword(e.target.value);
    }
  };

  const handleNewPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailAddress, password: newPassword }),
      });

      if (response.ok) {
        toast.success("Password updated successfully", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/login", { replace: true });
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.message || "An error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Update password error:", error);
      setError("An error occurred. Please try again later.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleNewPassword();
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
              <h1 className="font-bold text-3xl text-white">RESET PASSWORD</h1>
              <p className="text-white">Enter your new password</p>
            </div>
            <div>
              <div className="flex flex-col mb-5">
                <label className="text-xs font-semibold text-white">
                  New Password
                </label>
                <div className="flex items-center bg-white rounded-lg p-2">
                  <Icon
                    path={mdiLock}
                    title="New Password"
                    size={1}
                    color="black"
                    className="mr-1"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full p-2 text-black rounded-lg outline-none"
                    placeholder="New Password"
                    name="newPassword"
                    value={newPassword}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    required
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
              </div>
              <div className="flex flex-col mb-12">
                <label className="text-xs font-semibold text-white">
                  Confirm Password
                </label>
                <div className="flex items-center bg-white rounded-lg p-2">
                  <Icon
                    path={mdiLock}
                    title="Confirm Password"
                    size={1}
                    color="black"
                    className="mr-1"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full p-2 text-black rounded-lg outline-none"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    required
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
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex">
                <button
                  onClick={handleNewPassword}
                  className="w-full max-w-xs mx-auto bg-white hover:scale-110 transition-all duration-500 text-black rounded-full px-3 py-3 font-semibold"
                >
                  Reset Password
                </button>
              </div>
              <p className="text-white pt-4">
                Remembered your password?{" "}
                <Link to="/login" className="font-semibold underline">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default NewPassword;
