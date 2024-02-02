import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Icon from "@mdi/react";
import {
  mdiAccount,
  mdiGenderMale,
  mdiEmail,
  mdiLock,
  mdiEyeOutline,
  mdiEyeOffOutline,
  mdiPhone,
} from "@mdi/js";
import { BASE_URL } from "../../services/api";
import Logo from "../../resources/images/logo.png";
const Register = () => {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "fullName") {
      setFullName(value);
    } else if (name === "gender") {
      setGender(value);
    } else if (name === "mobile") {
      setMobile(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(`${BASE_URL}api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          gender,
          mobile,
          email,
          password,
        }),
      });

      if (response.ok) {
        // Handle registration success logic here
        toast.success("Registration Successful", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        // Handle registration failure logic here
        handleErrorResponse(response.status);
      }
    } catch (error) {
      console.error("Registration error:", error);
      // Handle registration error logic here
      setError("An error occurred. Please try again later.");
    }
  };

  const handleErrorResponse = (status) => {
    let errorMessage = "";
    // Handle different registration error statuses
    // ...

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

  const [error, setError] = useState(null);

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
          {/* Image Section - Replace with your actual image component */}
          <div className="hidden md:flex items-center justify-center w-1/2 bg-black py-10 px-10">
            <img src={Logo} alt={"Pic"} />
          </div>

          {/* Registration Form Section */}
          <div className="w-full md:w-1/2 py-10 px-5 md:px-10 bg-black">
            <div className="text-center mb-10">
              <h1 className="font-bold text-3xl text-white">REGISTER</h1>
              <p className="text-white">Create your account</p>
            </div>
            <div>
              {/* Full Name */}
              <div className="flex flex-col mb-5">
                <label className="text-xs font-semibold text-white">
                  Full Name
                </label>
                <div className="flex items-center rounded lg bg-white p-2">
                  <Icon
                    path={mdiAccount}
                    title="User Profile"
                    size={1}
                    color="black"
                    className="mr-1"
                  />
                  <input
                    type="text"
                    className="w-full p-2 text-black rounded-lg outline-none"
                    placeholder="Full Name"
                    name="fullName"
                    value={fullName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="flex flex-col mb-5">
                <label className="text-xs font-semibold text-white">
                  Gender
                </label>
                <div className="flex items-center rounded lg bg-white p-2">
                  <Icon
                    path={mdiGenderMale}
                    title="Gender"
                    size={1}
                    color="black"
                    className="mr-1"
                  />
                  <input
                    type="text"
                    className="w-full p-2 text-black rounded-lg outline-none"
                    placeholder="Gender"
                    name="gender"
                    value={gender}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Mobile */}
              <div className="flex flex-col mb-5">
                <label className="text-xs font-semibold text-white">
                  Mobile
                </label>
                <div className="flex items-center rounded lg bg-white p-2">
                  {/* Mobile icon goes here */}
                  <Icon
                    path={mdiPhone}
                    title="Gender"
                    size={1}
                    color="black"
                    className="mr-1"
                  />
                  <input
                    type="text"
                    className="w-full p-2 text-black rounded-lg outline-none"
                    placeholder="Mobile"
                    name="mobile"
                    value={mobile}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col mb-5">
                <label className="text-xs font-semibold text-white">
                  Email
                </label>
                <div className="flex items-center rounded lg bg-white p-2">
                  <Icon
                    path={mdiEmail}
                    title="Email"
                    size={1}
                    color="black"
                    className="mr-1"
                  />
                  <input
                    type="email"
                    className="w-full p-2 text-black rounded-lg outline-none"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col mb-5">
                <label className="text-xs font-semibold text-white">
                  Password
                </label>
                <div className="flex items-center rounded lg bg-white p-2">
                  <Icon
                    path={mdiLock}
                    title="Password"
                    size={1}
                    color="black"
                    className="mr-1"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full p-2 text-black rounded-lg outline-none"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={handleInputChange}
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

              {/* Register Button */}
              <div className="flex">
                <button
                  onClick={handleRegister}
                  className="w-full max-w-xs mx-auto bg-white hover:scale-110 transition-all duration-500 text-black rounded-full px-3 py-3 font-semibold"
                >
                  Register
                </button>
              </div>

              {/* Sign In Link */}
              <p className="text-white p-4">
                Already have an account?{" "}
                <a href="/login" className="font-semibold underline">
                  Sign In
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

export default Register;
