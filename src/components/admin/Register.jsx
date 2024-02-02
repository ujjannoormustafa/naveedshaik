// Register.js
import React, { useState } from "react";
import { mdiAccountOutline, mdiEyeOutline, mdiEyeOffOutline } from "@mdi/js";
import Logo from "../../resources/images/logo.png";
import Icon from "@mdi/react";
const Register = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    // Your signup logic here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="bg-white py-8 md:py-0">
      <div className="flex flex-col items-center justify-center md:px-0 md:py-0 px-6 py-8 m-auto lg:py-0">
        <div className="w-full bg-black rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <a
              href="#"
              className="flex items-center justify-center mb-6 text-2xl font-semibold text-white"
            >
              <img className="w-8 h-8 mr-2" src={Logo} alt="logo" />
              H2O Events
            </a>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              {/* Full Name Field */}
              <div>
                <label
                  htmlFor="fullname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Full Name
                </label>
                <div className="relative">
                  <mdiAccountOutline
                    className="absolute top-3 left-3 text-gray-500"
                    size={20}
                  />
                  <input
                    type="text"
                    id="fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="bg-white text-black sm:text-sm rounded-lg focus:ring-primary-600 block w-full p-2.5"
                    placeholder="Full Name"
                    required="true"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white text-black sm:text-sm rounded-lg focus:ring-primary-600 block w-full p-2.5"
                  placeholder="name@gmail.com"
                  required=""
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <div className="flex">
                  <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                    <Icon
                      path={mdiEyeOffOutline}
                      title="Phone number"
                      size={1}
                      color="black"
                    />
                  </div>
                  <input
                    type="text"
                    className="w-full text-black -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-white-500"
                    placeholder="••••••••"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Role Field */}
              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="text-black sm:text-sm rounded-lg block w-full p-2.5"
                >
                  <option value="user" className="py-4 text-md font-bold">
                    User
                  </option>
                  <option
                    value="admin"
                    className="py-2 text-black hover:bg-black hover:text-white"
                  >
                    Admin
                  </option>
                </select>
              </div>

              {/* Remaining fields go here */}

              {/* Signup Button */}
              <button
                type="submit"
                onClick={handleSignup}
                className="w-full text-black bg-white hover:bg-primary-700 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Create an account
              </button>

              {/* Login Link */}
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
